// Link

export function toggleLink(editor: any, isLink: boolean) {
  if (!editor) return;

  if (isLink) {
    editor.commands.unsetLink();
    return;
  }

  const value = prompt("Nhập URL:");
  if (value) editor.commands.setLink({ href: value });
}

// INLINE Mathematical formular

export function insertInlineMath(editor: any) {
  if (!editor) return;

  const value = prompt("Nhập công thức (LateX):");
  if (value)
    editor.commands.insertInlineMath({
      latex: value,
    });
}

// BLOCK Mathematical formular

export function insertBlockMath(editor: any) {
  if (!editor) return;

  const value = prompt("Nhập công thức (LateX):");
  if (value)
    editor.commands.insertBlockMath({
      latex: value,
    });
}

// IMAGE

export function insertImage(editor: any) {
  if (!editor) return;

  const value = prompt("Nhập URL ảnh (.jpg/.jpeg/.png/.gif/.svg/...):");
  if (!value) return;

  const imgName = value.match(/\/([^\/]+)\.[^\/.]+$/);

  editor.commands.setImage({
    src: value,
    alt: imgName ? imgName[0] : "",
  });
}
