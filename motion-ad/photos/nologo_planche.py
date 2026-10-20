# One pass from the original planche photo: paints out apparel and equipment prints.
# The athlete's body is never touched. Writes planche-park-nologo.webp once.
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,'planche-park.jpg')
DST=os.path.join(HERE,'planche-park-nologo.webp')
orig=np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
out=orig.copy()
rng=np.random.default_rng(5)

def harmonic(win, mask, known, iters=500):
    w=win.copy(); w[mask]=0
    for it in range(iters):
        k0=known|(mask if it>0 else np.zeros_like(mask))
        acc=np.zeros_like(w); cnt=np.zeros(mask.shape,np.float32)
        for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            k=np.roll(np.roll(k0,dy,0),dx,1); acc+=np.roll(np.roll(w,dy,0),dx,1)*k[...,None]; cnt+=k
        w[mask]=(acc/np.maximum(cnt,1)[...,None])[mask]
    return w

def local(box, pad, mode, thr, grow, poly=None, noise=3.0):
    x0,y0,x1,y1=box; X0,Y0,X1,Y1=x0-pad,y0-pad,x1+pad,y1+pad
    win=out[Y0:Y1,X0:X1].copy(); lum=win.mean(axis=2)
    bg=np.asarray(Image.fromarray(lum.clip(0,255).astype(np.uint8)).filter(ImageFilter.MedianFilter(25))).astype(np.float32)
    inside=np.zeros(lum.shape,bool)
    if poly:
        pm=Image.new('L',(X1-X0,Y1-Y0),0); ImageDraw.Draw(pm).polygon([(px-X0,py-Y0) for px,py in poly],fill=255); inside=np.asarray(pm)>0
    else:
        inside[y0-Y0:y1-Y0,x0-X0:x1-X0]=True
    diff=(lum-bg) if mode=='light' else (bg-lum)
    m=inside&(diff>thr)
    m=np.asarray(Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(grow)))>0
    m&=np.asarray(Image.fromarray((inside*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)))>0
    known=(~m)&(np.abs(lum-bg)<=10)
    w=harmonic(win,m,known)
    w[m]+=rng.normal(0,noise,(m.sum(),1))
    out[Y0:Y1,X0:X1]=w
    return int(m.sum())

n={}
# OFFICIAL print on the shorts (light on mauve), inside a polygon along the lettering
n['shorts']=local((700,980,792,1080),20,'light',12,7,poly=[(704,1077),(741,1077),(787,1004),(780,983),(746,983)],noise=3.5)
# green lettering on the spectator's white cap
n['cap']=local((882,845,912,863),20,'dark',10,3)
# VIA FORTIS on the black parallette base
n['fortis']=local((101,1232,144,1249),20,'light',8,3)
# small logo on the athlete's black wristband (fabric only)
n['wrist']=local((768,1250,789,1268),20,'light',14,3)

# Waistband lettering: the band slopes up to the right, so work in band-aligned rows.
# For each column find the band's top (first blue row), then in rows 1-7 below it
# replace any pixel brighter than the band around it (the print) with the darkest
# band pixels along the same row.
x0,x1=556,668
top=[]
for x in range(x0,x1):
    col=orig[788:818,x]; br=col[:,2]-col[:,0]
    rows=np.where(br>30)[0]
    top.append(788+rows[0] if len(rows) else -1)
top=np.array(top,float); ok=top>0
top[~ok]=np.interp(np.where(~ok)[0],np.where(ok)[0],top[ok])
top=np.array([np.median(top[max(0,i-4):i+5]) for i in range(len(top))]).round().astype(int)
cnt=0
for k in range(1,8):
    vals=np.array([orig[top[i]+k, x0+i] for i in range(x1-x0)])
    blue=vals[:,2]-vals[:,0]>25
    L=vals.mean(axis=1)
    for i in range(x1-x0):
        if not blue[i] and L[i]<60: continue
        a2,b2=max(0,i-8),min(x1-x0,i+9)
        cand=[j for j in range(a2,b2) if blue[j]]
        if len(cand)<4: continue
        cand=np.array(cand); dark=cand[np.argsort(L[cand])[:5]]
        est=vals[dark].mean(axis=0)
        if L[i]>est.mean()+8:
            out[top[i]+k, x0+i]=est+rng.normal(0,2.0); cnt+=1
n['waist']=cnt
Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(DST,quality=95,method=6)
print(n)
