if (typeof DataTransfer.prototype.setDragImage !== 'function') {
  DataTransfer.prototype.setDragImage = function (image, offsetX, offsetY) {
    var randomDraggingClassName,
      dragStylesCSS,
      dragStylesEl,
      headEl,
      parentFn,
      eventTarget

      // generate a random class name that will be added to the element
    randomDraggingClassName = 'setdragimage-ie-dragging-' + Math.round(Math.random() * Math.pow(10, 5)) + '-' + Date.now()

    // prepare the rules for the random class
    dragStylesCSS = [
      '.' + randomDraggingClassName,
      '{',
      'background: url("' + image.src + '") no-repeat #fff 0 0 !important;',
      'width: ' + image.width + 'px !important;',
      'height: ' + image.height + 'px !important;',
      'text-indent: -9999px !important;',
      'border: 0 !important;',
      'outline: 0 !important;',
      '}',
      '.' + randomDraggingClassName + ' * {',
      'display: none !important;',
      '}'
    ]
    // create the element and add it to the head of the page
    dragStylesEl = document.createElement('style')
    dragStylesEl.innerText = dragStylesCSS.join('')
    headEl = document.getElementsByTagName('head')[0]
    headEl.appendChild(dragStylesEl)

    /*
      since we can't get the target element over which the drag start event occurred
      (because the `this` represents the DataTransfer object and not the element),
      we will walk through the parents of the current functions until we find one
      whose first argument is a drag event
       */
    parentFn = DataTransfer.prototype.setDragImage.caller
    while (!(parentFn.arguments[0] instanceof DragEvent)) {
      parentFn = parentFn.caller
    }

    // then, we get the target element from the event (event.target)
    eventTarget = parentFn.arguments[0].target
    // and add the class we prepared to it
    eventTarget.classList.add(randomDraggingClassName)

    /* immediately after adding the class, we remove it. in this way the browser will
      have time to make a snapshot and use it just so it looks like the drag element */
    setTimeout(function () {
      // remove the styles
      headEl.removeChild(dragStylesEl)
      // remove the class
      eventTarget.classList.remove(randomDraggingClassName)
    }, 0)
  }
}
