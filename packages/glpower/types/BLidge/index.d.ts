import { EventEmitter } from '../utils/EventEmitter';
import { IVector2, IVector3 } from "../Math/Vector";
import { FCurveGroup } from '../Animation/FCurveGroup';
export declare type BLidgeObjectMessage = {
    n: string;
    prnt: string;
    chld?: BLidgeObjectMessage[];
    anim?: BLidgeAnimation;
    ps: IVector3;
    rt?: IVector3;
    sc?: IVector3;
    mat?: {
        n?: string;
        uni?: BLidgeAnimation;
    };
    t: BLidgeObjectType;
    v: boolean;
    prm?: BLidgeCameraParam | BLidgeMeshParam | BLidgeLightParamCommon;
};
export declare type BLidgeObject = {
    name: string;
    parent: string;
    children: BLidgeObject[];
    animation: BLidgeAnimation;
    position: IVector3;
    rotation: IVector3;
    scale: IVector3;
    material: BLidgeMaterialParam;
    type: BLidgeObjectType;
    visible: boolean;
    param?: BLidgeCameraParam | BLidgeMeshParam | BLidgeLightParamCommon;
};
export declare type BLidgeObjectType = 'empty' | 'cube' | 'sphere' | 'cylinder' | 'mesh' | 'camera' | 'plane' | 'light';
export declare type BLidgeCameraParam = {
    fov: number;
};
export declare type BLidgeMeshParam = {
    position: number[];
    uv: number[];
    normal: number[];
    index: number[];
};
export declare type BLidgeLightParam = BLidgeDirectionalLightParam | BLidgeSpotLightParam;
declare type BLidgeLightParamCommon = {
    type: 'directional' | 'spot';
    color: IVector3;
    intensity: number;
    shadowMap: boolean;
};
export declare type BLidgeDirectionalLightParam = {
    type: 'directional';
} & BLidgeLightParamCommon;
export declare type BLidgeSpotLightParam = {
    type: 'spot';
    angle: number;
    blend: number;
} & BLidgeLightParamCommon;
export declare type BLidgeMaterialParam = {
    name: string;
    uniforms: BLidgeAnimation;
};
export declare type BLidgeSceneData = {
    animations: {
        [key: string]: BLidgeAnimationCurveParam[];
    };
    scene: BLidgeObjectMessage;
    frame: BLidgeSceneFrame;
};
export declare type BLidgeAnimation = {
    [key: string]: string;
};
export declare type BLidgeAnimationCurveAxis = 'x' | 'y' | 'z' | 'w';
export declare type BLidgeAnimationCurveParam = {
    k: BLidgeAnimationCurveKeyFrameParam[];
    axis: BLidgeAnimationCurveAxis;
};
export declare type BLidgeAnimationCurveKeyFrameParam = {
    c: IVector2;
    h_l?: IVector2;
    h_r?: IVector2;
    e: string;
    i: "B" | "L" | "C";
};
export declare type BLidgeMessage = BLidgeSyncSceneMessage | BLidgeSyncFrameMessage;
export declare type BLidgeSyncSceneMessage = {
    type: "sync/scene";
    data: BLidgeSceneData;
};
export declare type BLidgeSyncFrameMessage = {
    type: "sync/timeline";
    data: BLidgeSceneFrame;
};
export declare type BLidgeSceneFrame = {
    start: number;
    end: number;
    current: number;
    fps: number;
    playing: boolean;
};
export declare class BLidge extends EventEmitter {
    private url?;
    private ws?;
    connected: boolean;
    frame: BLidgeSceneFrame;
    objects: BLidgeObject[];
    curveGroups: FCurveGroup[];
    scene: BLidgeObject | null;
    constructor(url?: string);
    connect(url: string): void;
    loadJsonScene(jsonPath: string): void;
    loadScene(data: BLidgeSceneData): void;
    private onSyncTimeline;
    private onOpen;
    private onMessage;
    private onClose;
    getCurveGroup(name: string): FCurveGroup | undefined;
    setFrame(frame: number): void;
    dispose(): void;
    disposeWS(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map