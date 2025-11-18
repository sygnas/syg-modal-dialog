/**
 * 画像ローダー
 * ズーム・ドラッグ機能付き
 */

export type ImageDragListeners = {
  startDrag: (e: MouseEvent) => void;
  doDrag: (e: MouseEvent) => void;
  endDrag: (e: MouseEvent) => void;
  touchStart: (e: TouchEvent) => void;
  touchMove: (e: TouchEvent) => void;
  touchEnd: (e: TouchEvent) => void;
  onResizeHandler: () => void;
  rafId: number | null;
};

/**
 * 画像を読み込み
 */
export async function loadImage(
  src: string,
  content: HTMLElement,
  dialog: HTMLDialogElement,
  container: HTMLElement
): Promise<ImageDragListeners> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.style.cursor = 'pointer';

    img.onload = () => {
      // naturalWidth/Heightを取得
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // syg-modal-dialog のサイズを取得
      const dialogWidth = dialog.clientWidth;
      const dialogHeight = dialog.clientHeight;

      // 画像がdialogに収まるようにcontainerのサイズを計算（object-fit:contain相当）
      // ただし、画像が小さい場合は拡大しない
      const aspectRatio = naturalWidth / naturalHeight;
      const dialogRatio = dialogWidth / dialogHeight;

      let containerWidth: number;
      let containerHeight: number;

      if (aspectRatio > dialogRatio) {
        // 横長の画像
        containerWidth = Math.min(dialogWidth, naturalWidth);
        containerHeight = containerWidth / aspectRatio;
      } else {
        // 縦長の画像
        containerHeight = Math.min(dialogHeight, naturalHeight);
        containerWidth = containerHeight * aspectRatio;
      }

      // containerのサイズと中央配置
      container.style.width = `${containerWidth}px`;
      container.style.height = `${containerHeight}px`;
      container.style.left = `${(dialogWidth - containerWidth) / 2}px`;
      container.style.top = `${(dialogHeight - containerHeight) / 2}px`;
      container.style.transformOrigin = '0 0';

      // ズーム・ドラッグ用の変数
      let isZoomed = false;
      let translateX = 0;
      let translateY = 0;
      let scale = 1;
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let mouseDownX = 0;
      let mouseDownY = 0;
      let dragStartTranslateX = 0;
      let dragStartTranslateY = 0;
      let rafId: number | null = null;
      let pendingTranslateX = 0;
      let pendingTranslateY = 0;
      let lastTouchTime = 0; // タッチイベント発火時刻を記録

      // matrixを適用する関数
      const applyTransform = () => {
        // matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
        container.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
      };

      // requestAnimationFrameを使った更新
      const updateTransform = () => {
        translateX = pendingTranslateX;
        translateY = pendingTranslateY;
        applyTransform();
        rafId = null;
      };

      // マウスダウン
      const onMouseDown = (e: MouseEvent) => {
        // タッチイベントの直後（500ms以内）ならマウスイベントを無視
        if (Date.now() - lastTouchTime < 500) {
          return;
        }
        
        if (e.target !== container && e.target !== img) return;

        isDragging = true;
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartTranslateX = translateX;
        dragStartTranslateY = translateY;
        container.style.cursor = isZoomed ? 'grabbing' : 'pointer';
      };

      // タッチスタート
      const onTouchStart = (e: TouchEvent) => {
        if (e.target !== container && e.target !== img) return;
        if (e.touches.length !== 1) return;

        lastTouchTime = Date.now(); // タッチ時刻を記録
        e.preventDefault(); // デフォルト動作を防止（クリックイベントの発火を防ぐ）
        const touch = e.touches[0];
        if (!touch) return;
        isDragging = true;
        mouseDownX = touch.clientX;
        mouseDownY = touch.clientY;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        dragStartTranslateX = translateX;
        dragStartTranslateY = translateY;
      };

      // マウスムーブ
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // ズーム時のみドラッグで移動
        if (isZoomed) {
          pendingTranslateX = dragStartTranslateX + deltaX;
          pendingTranslateY = dragStartTranslateY + deltaY;
          
          // requestAnimationFrameが未実行なら予約
          if (rafId === null) {
            rafId = requestAnimationFrame(updateTransform);
          }
        }
      };

      // タッチムーブ
      const onTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - dragStartX;
        const deltaY = touch.clientY - dragStartY;

        // ズーム時のみドラッグで移動
        if (isZoomed) {
          e.preventDefault(); // スクロール防止
          pendingTranslateX = dragStartTranslateX + deltaX;
          pendingTranslateY = dragStartTranslateY + deltaY;
          
          // requestAnimationFrameが未実行なら予約
          if (rafId === null) {
            rafId = requestAnimationFrame(updateTransform);
          }
        }
      };

      // 共通: ズーム処理
      const performZoom = (clientX: number, clientY: number) => {
        isZoomed = true;
        scale = naturalWidth / containerWidth;

        // dialog の位置
        const dialogRect = dialog.getBoundingClientRect();
        
        // クリック位置（dialog内の座標）
        const clickXInDialog = clientX - dialogRect.left;
        const clickYInDialog = clientY - dialogRect.top;

        // containerの左上座標（dialog内、transform適用前の位置）
        const containerLeft = parseFloat(container.style.left);
        const containerTop = parseFloat(container.style.top);

        // クリック位置（container内の座標）
        const clickXInContainer = clickXInDialog - containerLeft;
        const clickYInContainer = clickYInDialog - containerTop;
        
        translateX = clickXInContainer * (1 - scale);
        translateY = clickYInContainer * (1 - scale);

        container.style.cursor = 'grab';
        applyTransform();
      };

      // 共通: ズーム解除処理
      const performZoomOut = () => {
        isZoomed = false;
        scale = 1;
        translateX = 0;
        translateY = 0;
        container.style.cursor = 'pointer';
        applyTransform();
      };

      // 共通: クリック/タップ終了処理
      const handlePointerUp = (clientX: number, clientY: number) => {
        if (!isDragging) return;

        // 保留中のアニメーションフレームをキャンセル
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        const moveDistance = Math.sqrt(
          Math.pow(clientX - mouseDownX, 2) + Math.pow(clientY - mouseDownY, 2)
        );

        // 5px未満の移動ならクリック/タップとみなす
        if (moveDistance < 5) {
          if (isZoomed) {
            performZoomOut();
          } else {
            performZoom(clientX, clientY);
          }
        } else {
          // ドラッグ終了時に最終位置を反映
          translateX = pendingTranslateX;
          translateY = pendingTranslateY;
        }

        isDragging = false;
        if (isZoomed) {
          container.style.cursor = 'grab';
        }
      };

      // マウスアップ
      const onMouseUp = (e: MouseEvent) => {
        handlePointerUp(e.clientX, e.clientY);
      };

      // ウィンドウリサイズ時の処理
      const onResize = () => {
        // ズーム中はリサイズ処理をスキップ
        if (isZoomed) return;

        // dialog の新しいサイズを取得
        const newDialogWidth = dialog.clientWidth;
        const newDialogHeight = dialog.clientHeight;

        // containerのサイズを再計算
        const aspectRatio = naturalWidth / naturalHeight;
        const dialogRatio = newDialogWidth / newDialogHeight;

        let newContainerWidth: number;
        let newContainerHeight: number;

        if (aspectRatio > dialogRatio) {
          // 横長の画像
          newContainerWidth = Math.min(newDialogWidth, naturalWidth);
          newContainerHeight = newContainerWidth / aspectRatio;
        } else {
          // 縦長の画像
          newContainerHeight = Math.min(newDialogHeight, naturalHeight);
          newContainerWidth = newContainerHeight * aspectRatio;
        }

        // containerを中央に配置
        container.style.width = `${newContainerWidth}px`;
        container.style.height = `${newContainerHeight}px`;
        container.style.left = `${(newDialogWidth - newContainerWidth) / 2}px`;
        container.style.top = `${(newDialogHeight - newContainerHeight) / 2}px`;

        // containerWidth/Heightを更新（ズーム時の計算に使用）
        containerWidth = newContainerWidth;
        containerHeight = newContainerHeight;
      };

      // タッチエンド
      const onTouchEnd = (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault(); // デフォルト動作を防止（クリックイベントの発火を防ぐ）
        const touch = e.changedTouches[0];
        if (!touch) return;
        handlePointerUp(touch.clientX, touch.clientY);
      };

      // イベントリスナーを追加
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('touchstart', onTouchStart, { passive: false });
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onTouchEnd);
      document.addEventListener('touchcancel', onTouchEnd);
      window.addEventListener('resize', onResize);

      // 画像をコンテンツに追加
      content.innerHTML = '';
      content.appendChild(img);

      // ドラッグリスナーを返す
      resolve({
        startDrag: onMouseDown,
        doDrag: onMouseMove,
        endDrag: onMouseUp,
        touchStart: onTouchStart,
        touchMove: onTouchMove,
        touchEnd: onTouchEnd,
        onResizeHandler: onResize,
        rafId,
      });
    };

    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));

    img.src = src;
  });
}
