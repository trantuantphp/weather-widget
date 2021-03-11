import { ICON_URL } from "shared/constants";

export function getIcon(code: string): string {
  const prefix: string = "img/wn/";
  const iconFile = code + ".png";
  return ICON_URL + prefix + iconFile;
}
