import {Config} from '@remotion/cli/config';

// PNG frames keep type edges clean before H.264 encoding.
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(17);
Config.setOverwriteOutput(true);
