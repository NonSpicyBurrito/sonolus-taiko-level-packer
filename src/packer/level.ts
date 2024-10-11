import { osuToTJC, tjaToTJC, tjcToLevelData } from 'sonolus-taiko-engine'
import type { PackLevelData } from '.'

export const packLevelData: PackLevelData = async ({
    format,
    chartTja,
    courseId,
    chartOsu,
    offset,
}) => {
    const chart = format === 'tja' ? chartTja : chartOsu
    if (!chart) throw new Error('No chart file selected')

    const text = await chart.text()
    const tjc = format === 'tja' ? tjaToTJC(text, courseId) : osuToTJC(text)
    const levelData = tjcToLevelData(tjc, offset)

    return { type: 'json', data: levelData }
}
