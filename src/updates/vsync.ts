type VsyncActionIdentifier = () => symbol;
type VsyncCallback = (...args: any[]) => unknown;

export function createVsyncAction(name = "vsync_item"): VsyncActionIdentifier {
  return () => Symbol(name);
}

// TODO: Replace this with a WeakMap
const vsyncQueue = new Map<VsyncActionIdentifier, VsyncCallback>();

export function vsync(
  identifier: VsyncActionIdentifier,
  callback: VsyncCallback
) {
  vsyncQueue.set(identifier, callback);
  frame();
}

let hasQueuedFrame = false;
function frame() {
  if (hasQueuedFrame) {
    return;
  }

  hasQueuedFrame = true;

  requestAnimationFrame(() => {
    // We set the queued frame reference so that if the current frame takes
    // a long time to process, we don't drop a frame / state.
    hasQueuedFrame = false;

    for (const [identifier, callback] of vsyncQueue.entries()) {
      callback();
      vsyncQueue.delete(identifier);
    }
  });
}
