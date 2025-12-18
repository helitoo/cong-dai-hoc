export type ChartColor = { background: string; border: string };

export type ChartColors = ChartColor[];

function getRandNum(
  min: number = 0,
  max: number = 1,
  step: number = 1
): number {
  const steps = Math.floor((max - min) / step);
  const randStep = Math.floor(Math.random() * (steps + 1));
  return min + randStep * step;
}

export function getRandColor(alpha: number = 0.5) {
  const h = getRandNum(0, 345, 45);
  const s = getRandNum(40, 100);
  const l = getRandNum(30, 70);

  return {
    background: `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
    border: `hsl(${h}, ${s}%, ${l}%)`,
  };
}

// Trả về màu mới khác với các màu cũ nhất có thể
export function getColorDistinctWith(
  preColors: ChartColors,
  alpha: number = 0.5
) {
  // Nếu chưa có màu nào -> trả về màu random
  if (preColors.length === 0) return getRandColor(alpha);

  // 1. Lấy hue từ preColors (chỉ cần hue của border)
  const hues = preColors.map((c) => {
    const match = c.border.match(/hsl\((\d+),/);
    return match ? Number(match[1]) : getRandNum(0, 360);
  });

  // 2. Tìm hue mới "xa nhất" so với các hue đang có
  const step = 360 / 720; // quét 720 điểm (độ phân giải cao)
  let bestHue = 0;
  let bestDist = -1;

  for (let h = 0; h < 360; h += step) {
    // khoảng cách nhỏ nhất từ h đến các hue cũ
    const minDist = Math.min(
      ...hues.map((oldH) => {
        const d = Math.abs(h - oldH);
        return Math.min(d, 360 - d);
      })
    );

    // nếu h xa hơn tất cả hue đang có -> chọn
    if (minDist > bestDist) {
      bestDist = minDist;
      bestHue = h;
    }
  }

  // 3. Sinh color từ hue tốt nhất
  const s = getRandNum(40, 100);
  const l = getRandNum(30, 70);

  const newColor: ChartColor = {
    background: `hsla(${bestHue}, ${s}%, ${l}%, ${alpha})`,
    border: `hsl(${bestHue}, ${s}%, ${l}%)`,
  };

  return newColor;
}

// Trả về danh sách các màu ngẫu nhiên khác nhau
export function getRandColorArr(length: number, alpha: number = 0.5) {
  const colors = [];
  const hueStep = Math.floor(360 / length);

  for (let i = 0; i < length; i++) {
    const h = (i * hueStep + getRandNum(0, hueStep)) % 360;
    const s = getRandNum(40, 100);
    const l = getRandNum(30, 70);

    colors.push({
      background: `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
      border: `hsl(${h}, ${s}%, ${l}%)`,
    });
  }

  return colors;
}
