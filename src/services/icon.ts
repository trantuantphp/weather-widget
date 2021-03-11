import client from './client';

export function getIcon(code: string) {
    const prefix: string = "img/wn/";
    const iconFile = code + ".png";
    return client.get(prefix + iconFile);
}