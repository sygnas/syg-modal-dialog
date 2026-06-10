export async function loadImage(src, content, dialog, container) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.style.cursor = 'pointer';
        img.onload = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const dialogWidth = dialog.clientWidth;
            const dialogHeight = dialog.clientHeight;
            const aspectRatio = naturalWidth / naturalHeight;
            const dialogRatio = dialogWidth / dialogHeight;
            let containerWidth;
            let containerHeight;
            if (aspectRatio > dialogRatio) {
                containerWidth = Math.min(dialogWidth, naturalWidth);
                containerHeight = containerWidth / aspectRatio;
            }
            else {
                containerHeight = Math.min(dialogHeight, naturalHeight);
                containerWidth = containerHeight * aspectRatio;
            }
            container.style.width = `${containerWidth}px`;
            container.style.height = `${containerHeight}px`;
            container.style.left = `${(dialogWidth - containerWidth) / 2}px`;
            container.style.top = `${(dialogHeight - containerHeight) / 2}px`;
            container.style.transformOrigin = '0 0';
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
            let rafId = null;
            let pendingTranslateX = 0;
            let pendingTranslateY = 0;
            let lastTouchTime = 0;
            const applyTransform = () => {
                container.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
            };
            const updateTransform = () => {
                translateX = pendingTranslateX;
                translateY = pendingTranslateY;
                applyTransform();
                rafId = null;
            };
            const onMouseDown = (e) => {
                if (Date.now() - lastTouchTime < 500) {
                    return;
                }
                if (e.target !== container && e.target !== img)
                    return;
                isDragging = true;
                mouseDownX = e.clientX;
                mouseDownY = e.clientY;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                dragStartTranslateX = translateX;
                dragStartTranslateY = translateY;
                container.style.cursor = isZoomed ? 'grabbing' : 'pointer';
            };
            const onTouchStart = (e) => {
                if (e.target !== container && e.target !== img)
                    return;
                if (e.touches.length !== 1)
                    return;
                lastTouchTime = Date.now();
                e.preventDefault();
                const touch = e.touches[0];
                if (!touch)
                    return;
                isDragging = true;
                mouseDownX = touch.clientX;
                mouseDownY = touch.clientY;
                dragStartX = touch.clientX;
                dragStartY = touch.clientY;
                dragStartTranslateX = translateX;
                dragStartTranslateY = translateY;
            };
            const onMouseMove = (e) => {
                if (!isDragging)
                    return;
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                if (isZoomed) {
                    pendingTranslateX = dragStartTranslateX + deltaX;
                    pendingTranslateY = dragStartTranslateY + deltaY;
                    if (rafId === null) {
                        rafId = requestAnimationFrame(updateTransform);
                    }
                }
            };
            const onTouchMove = (e) => {
                if (!isDragging)
                    return;
                if (e.touches.length !== 1)
                    return;
                const touch = e.touches[0];
                if (!touch)
                    return;
                const deltaX = touch.clientX - dragStartX;
                const deltaY = touch.clientY - dragStartY;
                if (isZoomed) {
                    e.preventDefault();
                    pendingTranslateX = dragStartTranslateX + deltaX;
                    pendingTranslateY = dragStartTranslateY + deltaY;
                    if (rafId === null) {
                        rafId = requestAnimationFrame(updateTransform);
                    }
                }
            };
            const performZoom = (clientX, clientY) => {
                isZoomed = true;
                scale = naturalWidth / containerWidth;
                const dialogRect = dialog.getBoundingClientRect();
                const clickXInDialog = clientX - dialogRect.left;
                const clickYInDialog = clientY - dialogRect.top;
                const containerLeft = parseFloat(container.style.left);
                const containerTop = parseFloat(container.style.top);
                const clickXInContainer = clickXInDialog - containerLeft;
                const clickYInContainer = clickYInDialog - containerTop;
                translateX = clickXInContainer * (1 - scale);
                translateY = clickYInContainer * (1 - scale);
                container.style.cursor = 'grab';
                applyTransform();
            };
            const performZoomOut = () => {
                isZoomed = false;
                scale = 1;
                translateX = 0;
                translateY = 0;
                container.style.cursor = 'pointer';
                applyTransform();
            };
            const handlePointerUp = (clientX, clientY) => {
                if (!isDragging)
                    return;
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                const moveDistance = Math.sqrt(Math.pow(clientX - mouseDownX, 2) + Math.pow(clientY - mouseDownY, 2));
                if (moveDistance < 5) {
                    if (isZoomed) {
                        performZoomOut();
                    }
                    else {
                        performZoom(clientX, clientY);
                    }
                }
                else {
                    translateX = pendingTranslateX;
                    translateY = pendingTranslateY;
                }
                isDragging = false;
                if (isZoomed) {
                    container.style.cursor = 'grab';
                }
            };
            const onMouseUp = (e) => {
                handlePointerUp(e.clientX, e.clientY);
            };
            const onResize = () => {
                if (isZoomed)
                    return;
                const newDialogWidth = dialog.clientWidth;
                const newDialogHeight = dialog.clientHeight;
                const aspectRatio = naturalWidth / naturalHeight;
                const dialogRatio = newDialogWidth / newDialogHeight;
                let newContainerWidth;
                let newContainerHeight;
                if (aspectRatio > dialogRatio) {
                    newContainerWidth = Math.min(newDialogWidth, naturalWidth);
                    newContainerHeight = newContainerWidth / aspectRatio;
                }
                else {
                    newContainerHeight = Math.min(newDialogHeight, naturalHeight);
                    newContainerWidth = newContainerHeight * aspectRatio;
                }
                container.style.width = `${newContainerWidth}px`;
                container.style.height = `${newContainerHeight}px`;
                container.style.left = `${(newDialogWidth - newContainerWidth) / 2}px`;
                container.style.top = `${(newDialogHeight - newContainerHeight) / 2}px`;
                containerWidth = newContainerWidth;
                containerHeight = newContainerHeight;
            };
            const onTouchEnd = (e) => {
                if (!isDragging)
                    return;
                e.preventDefault();
                const touch = e.changedTouches[0];
                if (!touch)
                    return;
                handlePointerUp(touch.clientX, touch.clientY);
            };
            container.addEventListener('mousedown', onMouseDown);
            container.addEventListener('touchstart', onTouchStart, { passive: false });
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', onTouchEnd);
            window.addEventListener('resize', onResize);
            content.innerHTML = '';
            content.appendChild(img);
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
//# sourceMappingURL=imageLoader.js.map