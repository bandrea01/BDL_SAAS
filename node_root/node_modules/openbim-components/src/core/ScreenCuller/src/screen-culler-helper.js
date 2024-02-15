//
// Thanks to the advice here https://github.com/zalo/TetSim/commit/9696c2e1cd6354fb9bd40dbd299c58f4de0341dd
//
function clientWaitAsync(gl, sync, flags, intervalMilliseconds) {
    return new Promise((resolve, reject) => {
        function test() {
            const res = gl.clientWaitSync(sync, flags, 0);
            if (res === gl.WAIT_FAILED) {
                reject();
                return;
            }
            if (res === gl.TIMEOUT_EXPIRED) {
                setTimeout(test, intervalMilliseconds);
                return;
            }
            resolve();
        }
        test();
    });
}
async function getBufferSubDataAsync(gl, target, buffer, srcByteOffset, dstBuffer, dstOffset, length) {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    await clientWaitAsync(gl, sync, 0, 10);
    gl.deleteSync(sync);
    gl.bindBuffer(target, buffer);
    gl.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length);
    gl.bindBuffer(target, null);
}
export async function readPixelsAsync(gl, x, y, w, h, format, type, dest) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, dest.byteLength, gl.STREAM_READ);
    gl.readPixels(x, y, w, h, format, type, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    await getBufferSubDataAsync(gl, gl.PIXEL_PACK_BUFFER, buf, 0, dest);
    gl.deleteBuffer(buf);
    return dest;
}
//# sourceMappingURL=screen-culler-helper.js.map