import {Composition} from 'remotion';
import {XiaokeEdit} from './XiaokeEdit';

export const RemotionRoot = () => (
  <Composition
    id="XiaokeEdit"
    component={XiaokeEdit}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
  />
);
