export { default as db } from '@sonolus/free-pack/pack/db.json'

export const repository = Object.entries(
    import.meta.glob('@sonolus/free-pack/pack/repository/*', {
        query: '?arraybuffer',
        import: 'default',
        eager: true,
    }),
).map(([path, buffer]) => ({
    filename: path.slice(path.lastIndexOf('/') + 1),
    buffer: buffer as ArrayBuffer,
}))

export { default as engineConfiguration } from 'sonolus-taiko-engine/EngineConfiguration?arraybuffer'
export { default as enginePlayData } from 'sonolus-taiko-engine/EnginePlayData?arraybuffer'
export { default as enginePreviewData } from 'sonolus-taiko-engine/EnginePreviewData?arraybuffer'
export { default as engineThumbnail } from 'sonolus-taiko-engine/EngineThumbnail?arraybuffer'
export { default as engineTutorialData } from 'sonolus-taiko-engine/EngineTutorialData?arraybuffer'
export { default as engineWatchData } from 'sonolus-taiko-engine/EngineWatchData?arraybuffer'
