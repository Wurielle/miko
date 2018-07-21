const ProjectPaths = require('@project-paths');
const computedPath = new ProjectPaths({});
export const toAssetsExport = computedPath.toPUBLICPath() + computedPath.toAssetsExport();