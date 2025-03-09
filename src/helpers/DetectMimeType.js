var signatures = {
  JVBERi0: "pdf",
  R0lGODdh: "gif",
  R0lGODlh: "gif",
  iVBORw0KGgo: "png",
  "/9j/": "jpg",
  Qk02U: "bmp",
  "/9j/4/": "jpeg",
};

export const detectMimeType = (b64) => {
  for (var s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    } else {
      return null;
    }
  }
};
