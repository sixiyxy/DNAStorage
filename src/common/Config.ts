
// 开发阶段直接使用本地的 python 服务
//export const API_PREFIX = 'http://localhost:5000';

// 如果开发阶段要用服务器接口，采用这个，需要服务端支持跨域
export const API_PREFIX = 'https://dmci.xmu.edu.cn/dna-storage-designer-api';

// prod 环境，由于统一基于 dmci.xmu.edu.cn，通过后缀区分项目，并不存在跨域问题
// export const API_PREFIX = '/dna-storage-designer-api';

