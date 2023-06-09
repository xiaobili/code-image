import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues } from "@raycast/api";
import { encodeURI } from "js-base64";
import axios from "axios";
import fs from "fs";
import { getNowTime } from "./utils/date";
import { exec } from "child_process";

interface Preferences {
  theme: string;
  padding: number;
  darkMode: boolean;
  background: boolean;
  raysoUrl: string;
  SystemDirectory: string;
  OpenDirectory: boolean;
  CopyImage: boolean;
}

export default async () => {
  const preferences: Preferences = getPreferenceValues();

  let selectedText;
  try {
    selectedText = await getSelectedText();
  } catch (e) {
    await showHUD("截图生成失败。请确保您已选择要截屏的文本");
    return;
  }

  const base64Text = encodeURI(selectedText);

  await showToast(Toast.Style.Animated, "截图生成中");
  const url = preferences.raysoUrl;
  const data = {
    theme: preferences.theme,
    background: preferences.background,
    darkMode: preferences.darkMode,
    padding: preferences.padding,
    code: base64Text,
  };
  await axios
    .post(url, data, {
      responseType: "arraybuffer",
    })
    .then(async (res) => {
      if (res.status === 200) {
        const fileName = `rayso_${getNowTime()}.png`;
        const filePath = `${preferences.SystemDirectory}/${fileName}`;
        fs.writeFileSync(filePath, res.data);

        if (preferences.CopyImage) {
          const copy = exec(`osascript -e 'set the clipboard to (read (POSIX file "${filePath}") as JPEG picture)'`);
          copy.on("exit", () => {
            console.log("copy success");
            if (preferences.OpenDirectory) {
              const fileDir = preferences.SystemDirectory.replace(/ /g, "\\ ");
              exec(`open ${fileDir}`);
            }
          });
          await showToast(Toast.Style.Success, "截图生成成功");
          await showHUD("已复制到剪贴板");
        } else {
          await showToast(Toast.Style.Success, "截图生成成功");
          await showHUD("截图生成成功");
        }
      } else {
        await showToast(Toast.Style.Failure, res.data);
        await showHUD(res.data);
      }
    })
    .catch(async (e) => {
      await showToast(Toast.Style.Failure, e);
      await showHUD(e);
    });
};
