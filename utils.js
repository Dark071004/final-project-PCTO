export function showLoader(overlay) {
  if (overlay) {
    overlay.style.display = 'flex'
  }
}

export function hideLoader(overlay) {
  if (overlay) {
    overlay.style.display = 'none'
  }
}
