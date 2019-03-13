/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  return typeof str.trim() !== 'undefined' || str.trim() != null || str.trim() !== ''
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
