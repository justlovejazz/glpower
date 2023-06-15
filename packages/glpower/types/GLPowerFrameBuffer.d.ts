import { GLPowerTexture } from "./GLPowerTexture";
import { Vector } from "./Math/Vector";
export declare type GLPowerFrameBfferOpt = {
    disableDepthBuffer?: boolean;
};
export declare class GLPowerFrameBuffer {
    size: Vector;
    private gl;
    frameBuffer: WebGLFramebuffer | null;
    depthRenderBuffer: WebGLRenderbuffer | null;
    textures: GLPowerTexture[];
    textureAttachmentList: number[];
    constructor(gl: WebGL2RenderingContext, opt?: GLPowerFrameBfferOpt);
    setDepthBuffer(renderBuffer: WebGLRenderbuffer | null): void;
    setTexture(textures: GLPowerTexture[]): this;
    setSize(size: Vector): void;
    setSize(width: number, height: number): void;
    getFrameBuffer(): WebGLFramebuffer | null;
    dispose(): void;
}
//# sourceMappingURL=GLPowerFrameBuffer.d.ts.map