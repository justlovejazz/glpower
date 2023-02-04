class P {
  constructor(t, e) {
    this.gl = t, this.program = e, this.vao = this.gl.createVertexArray(), this.attributes = /* @__PURE__ */ new Map(), this.indexBuffer = null, this.vertCount = 0, this.indexCount = 0, this.instanceCount = 0;
  }
  setAttribute(t, e, s, i) {
    const r = this.attributes.get(t), h = e.array ? e.array.length / s : 0;
    return this.attributes.set(t, {
      ...r,
      buffer: e,
      size: s,
      count: h,
      ...i,
      location: void 0
    }), this.updateAttributes(), this;
  }
  removeAttribute(t) {
    return this.attributes.delete(t), this;
  }
  updateAttributes(t) {
    !this.vao || (this.vertCount = 0, this.instanceCount = 0, this.gl.bindVertexArray(this.vao), this.attributes.forEach((e, s) => {
      (e.location === void 0 || t) && (e.location = this.gl.getAttribLocation(this.program, s), e.location > -1 && (this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e.buffer.buffer), this.gl.enableVertexAttribArray(e.location), this.gl.vertexAttribPointer(e.location, e.size, this.gl.FLOAT, !1, 0, 0), e.instanceDivisor !== void 0 && this.gl.vertexAttribDivisor(e.location, e.instanceDivisor))), this.vertCount = Math.max(this.vertCount, e.count), e.instanceDivisor !== void 0 && e.instanceDivisor > 0 && (this.instanceCount == 0 ? this.instanceCount = e.count : this.instanceCount = Math.min(this.instanceCount, e.count));
    }), this.gl.bindVertexArray(null));
  }
  setIndex(t) {
    this.indexBuffer = t, this.vao && (this.gl.bindVertexArray(this.vao), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer ? this.indexBuffer.buffer : null), this.gl.bindVertexArray(null), this.indexBuffer && this.indexBuffer.array && (this.indexCount = this.indexBuffer.array.length));
  }
  use(t) {
    this.gl.bindVertexArray(this.vao), t && t(this), this.gl.bindVertexArray(null);
  }
  getVAO() {
    return this.vao;
  }
}
class L {
  constructor(t) {
    this.gl = t, this.program = this.gl.createProgram(), this.vao = /* @__PURE__ */ new Map(), this.uniforms = /* @__PURE__ */ new Map();
  }
  setShader(t, e, s) {
    if (this.program === null) {
      console.warn("program is null.");
      return;
    }
    const i = this.createShader(t, this.gl.VERTEX_SHADER), r = this.createShader(e, this.gl.FRAGMENT_SHADER);
    if (!(!i || !r))
      return this.gl.attachShader(this.program, i), this.gl.attachShader(this.program, r), s && s.transformFeedbackVaryings && this.gl.transformFeedbackVaryings(this.program, s.transformFeedbackVaryings, this.gl.SEPARATE_ATTRIBS), this.gl.linkProgram(this.program), this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS) || console.error("program link error:", this.gl.getProgramInfoLog(this.program)), this;
  }
  createShader(t, e) {
    const s = this.gl.createShader(e);
    return s ? (this.gl.shaderSource(s, t), this.gl.compileShader(s), this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS) ? s : (console.error(this.gl.getShaderInfoLog(s)), null)) : null;
  }
  setUniform(t, e, s) {
    const i = this.uniforms.get(t);
    if (i)
      if (i.type = e, i.value = s, i.cache) {
        for (let r = 0; r < s.length; r++)
          if (i.cache[r] !== s[r]) {
            i.needsUpdate = !0;
            break;
          }
      } else
        i.needsUpdate = !0;
    else
      this.uniforms.set(t, {
        value: s,
        type: e,
        location: null,
        needsUpdate: !0
      }), this.updateUniformLocations();
  }
  updateUniformLocations(t) {
    !this.program || this.uniforms.forEach((e, s) => {
      (e.location === null || t) && (e.location = this.gl.getUniformLocation(this.program, s));
    });
  }
  uploadUniforms() {
    this.uniforms.forEach((t) => {
      t.needsUpdate && (/Matrix[2|3|4]fv/.test(t.type) ? this.gl["uniform" + t.type](t.location, !1, t.value) : /[1|2|3|4][f|i]$/.test(t.type) ? this.gl["uniform" + t.type](t.location, ...t.value) : this.gl["uniform" + t.type](t.location, t.value), t.cache = t.value.concat(), t.needsUpdate = !1);
    });
  }
  getVAO(t = "_") {
    if (!this.program)
      return null;
    let e = this.vao.get(t);
    return e || (e = new P(this.gl, this.program), this.vao.set(t, e), e);
  }
  use(t) {
    !this.program || (this.gl.useProgram(this.program), t && t(this), this.gl.useProgram(null));
  }
  getProgram() {
    return this.program;
  }
}
class k {
  constructor(t) {
    this.gl = t, this.buffer = this.gl.createBuffer(), this.array = null;
  }
  setData(t, e = "vbo", s) {
    const i = e == "vbo" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    return this.gl.bindBuffer(i, this.buffer), this.gl.bufferData(i, t, s || this.gl.STATIC_DRAW), this.gl.bindBuffer(i, null), this.array = t, this;
  }
}
class F {
  constructor(t, e, s, i) {
    this.x = t || 0, this.y = e || 0, this.z = s || 0, this.w = i || 0;
  }
  get isVector() {
    return !0;
  }
  set(t, e, s, i) {
    return this.x = t, this.y = e != null ? e : this.y, this.z = s != null ? s : this.z, this.w = i != null ? i : this.w, this;
  }
  add(t) {
    var e, s, i, r;
    return typeof t == "number" ? (this.x += t, this.y += t, this.z += t, this.w += t) : (this.x += (e = t.x) != null ? e : 0, this.y += (s = t.y) != null ? s : 0, this.z += (i = t.z) != null ? i : 0, this.w += (r = t.w) != null ? r : 0), this;
  }
  sub(t) {
    var e, s, i, r;
    return typeof t == "number" ? (this.x -= t, this.y -= t, this.z -= t) : (this.x -= (e = t.x) != null ? e : 0, this.y -= (s = t.y) != null ? s : 0, this.z -= (i = t.z) != null ? i : 0, this.w -= (r = t.w) != null ? r : 0), this;
  }
  multiply(t) {
    return typeof t == "number" ? (this.x *= t, this.y *= t, this.z *= t, this.w *= t) : (this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w), this;
  }
  divide(t) {
    return typeof t == "number" ? (this.x /= t, this.y /= t, this.z /= t, this.w /= t) : (this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w), this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  normalize() {
    return this.divide(this.length() || 1);
  }
  cross(t) {
    const e = this.x, s = this.y, i = this.z, r = t.x, h = t.y, c = t.z;
    return this.x = s * c - i * h, this.y = i * r - e * c, this.z = e * h - s * r, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  applyMatrix3(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], h = e[4], c = e[5], a = e[6], o = e[8], f = e[9], l = e[10], m = this.x * s + this.y * h + this.z * o, g = this.x * i + this.y * c + this.z * f, p = this.x * r + this.y * a + this.z * l;
    this.x = m, this.y = g, this.z = p, this.w = 0;
  }
  applyMatrix4(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], h = e[3], c = e[4], a = e[5], o = e[6], f = e[7], l = e[8], m = e[9], g = e[10], p = e[11], y = e[12], d = e[13], E = e[14], n = e[15], b = this.x * s + this.y * c + this.z * l + this.w * y, A = this.x * i + this.y * a + this.z * m + this.w * d, x = this.x * r + this.y * o + this.z * g + this.w * E, R = this.x * h + this.y * f + this.z * p + this.w * n;
    return this.x = b, this.y = A, this.z = x, this.w = R, this;
  }
  copy(t) {
    var e, s, i, r;
    return this.x = (e = t.x) != null ? e : 0, this.y = (s = t.y) != null ? s : 0, this.z = (i = t.z) != null ? i : 0, this.w = (r = t.w) != null ? r : 0, this;
  }
  clone() {
    return new F(this.x, this.y, this.z, this.w);
  }
  getElm(t) {
    return t == "vec2" ? [this.x, this.y] : t == "vec3" ? [this.x, this.y, this.z] : [this.x, this.y, this.z, this.w];
  }
}
class X {
  constructor(t) {
    this.gl = t, this.image = null, this.unit = 0, this.size = new F(), this.texture = this.gl.createTexture(), this._setting = {
      type: this.gl.UNSIGNED_BYTE,
      internalFormat: this.gl.RGBA,
      format: this.gl.RGBA,
      magFilter: this.gl.NEAREST,
      minFilter: this.gl.NEAREST,
      generateMipmap: !1,
      wrapS: this.gl.CLAMP_TO_EDGE,
      wrapT: this.gl.CLAMP_TO_EDGE
    };
  }
  get isTexture() {
    return !0;
  }
  setting(t) {
    return this._setting = {
      ...this._setting,
      ...t
    }, this.attach(this.image), this;
  }
  attach(t) {
    return this.image = t, this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture), this.image ? (this.size.set(this.image.width, this.image.height), this.image instanceof HTMLImageElement ? this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._setting.internalFormat, this._setting.format, this._setting.type, this.image) : this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._setting.internalFormat, this.image.width, this.image.height, 0, this._setting.format, this._setting.type, null)) : (this.size.set(1, 1), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._setting.internalFormat, this.size.x, this.size.y, 0, this._setting.format, this._setting.type, null)), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this._setting.magFilter), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this._setting.minFilter), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this._setting.wrapS), this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this._setting.wrapT), this._setting.generateMipmap && this.gl.generateMipmap(this.gl.TEXTURE_2D), this.gl.bindTexture(this.gl.TEXTURE_2D, null), this;
  }
  activate(t) {
    return this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture), this.unit = t, this;
  }
  load(t, e) {
    const s = new Image();
    return s.onload = () => {
      this.attach(s), e && e();
    }, s.src = t, this;
  }
  getTexture() {
    return this.texture;
  }
  loadAsync(t) {
    return new Promise((e, s) => {
      const i = new Image();
      i.onload = () => {
        this.attach(i), e(this);
      }, i.onerror = () => {
        s("img error, " + t);
      }, i.src = t;
    });
  }
}
class G {
  constructor(t) {
    this.gl = t, this.size = new F(1, 1), this.frameBuffer = this.gl.createFramebuffer(), this.depthRenderBuffer = this.gl.createRenderbuffer(), this.textures = [], this.textureAttachmentList = [], this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer), this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
  }
  setTexture(t) {
    return this.textures = t, this.textureAttachmentList.length = 0, this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer), this.textures.forEach((e, s) => {
      e.attach({ width: this.size.x, height: this.size.y }), this.gl.bindTexture(this.gl.TEXTURE_2D, e.getTexture()), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      const i = this.gl.COLOR_ATTACHMENT0 + s;
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, i, this.gl.TEXTURE_2D, e.getTexture(), 0), this.textureAttachmentList.push(i);
    }), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this;
  }
  setSize(t, e) {
    typeof t == "number" ? (this.size.x = t, e !== void 0 && (this.size.y = e)) : this.size.copy(t), this.setTexture(this.textures), this.textures.forEach((s) => {
      s.attach({ width: this.size.x, height: this.size.y });
    }), this.depthRenderBuffer && (this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT32F, this.size.x, this.size.y), this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null));
  }
  getFrameBuffer() {
    return this.frameBuffer;
  }
}
class H {
  constructor(t) {
    this.gl = t, this.gl.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0), this.gl.getExtension("EXT_color_buffer_float"), this.gl.getExtension("EXT_color_buffer_half_float");
  }
  createProgram() {
    return new L(this.gl);
  }
  createBuffer() {
    return new k(this.gl);
  }
  createTexture() {
    return new X(this.gl);
  }
  createFrameBuffer() {
    return new G(this.gl);
  }
}
class j {
  constructor(t) {
    this.gl = t, this.transformFeedback = this.gl.createTransformFeedback(), this.feedbackBuffer = /* @__PURE__ */ new Map();
  }
  bind(t) {
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback), t && t(), this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
  }
  setBuffer(t, e, s) {
    this.feedbackBuffer.set(t, {
      buffer: e,
      varyingIndex: s
    });
  }
  use(t) {
    this.bind(() => {
      this.feedbackBuffer.forEach((e) => {
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, e.varyingIndex, e.buffer.buffer);
      }), t && t(this), this.feedbackBuffer.forEach((e) => {
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, e.varyingIndex, null);
      });
    });
  }
}
class O {
  constructor(t) {
    this.elm = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t && this.set(t);
  }
  identity() {
    return this.elm = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], this;
  }
  clone() {
    return new O().copy(this);
  }
  copy(t) {
    return this.set(t.elm), this;
  }
  perspective(t, e, s, i) {
    var r = 1 / Math.tan(t * Math.PI / 360), h = i - s;
    return this.elm = [
      r / e,
      0,
      0,
      0,
      0,
      r,
      0,
      0,
      0,
      0,
      -(i + s) / h,
      -1,
      0,
      0,
      -(i * s * 2) / h,
      0
    ], this;
  }
  orthographic(t, e, s, i) {
    return this.elm = [
      2 / t,
      0,
      0,
      0,
      0,
      2 / e,
      0,
      0,
      0,
      0,
      -2 / (i - s),
      0,
      0,
      0,
      -(i + s) / (i - s),
      1
    ], this;
  }
  lookAt(t, e, s) {
    const i = t.clone().sub(e).normalize(), r = s.clone().cross(i).normalize(), h = i.clone().cross(r).normalize();
    return this.elm = [
      r.x,
      h.x,
      i.x,
      0,
      r.y,
      h.y,
      i.y,
      0,
      r.z,
      h.z,
      i.z,
      0,
      -t.dot(r),
      -t.dot(h),
      -t.dot(i),
      1
    ], this;
  }
  inverse() {
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], h = this.elm[5], c = this.elm[6], a = this.elm[7], o = this.elm[8], f = this.elm[9], l = this.elm[10], m = this.elm[11], g = this.elm[12], p = this.elm[13], y = this.elm[14], d = this.elm[15], E = t * h - e * r, n = t * c - s * r, b = t * a - i * r, A = e * c - s * h, x = e * a - i * h, R = s * a - i * c, _ = o * p - f * g, v = o * y - l * g, z = o * d - m * g, B = f * y - l * p, M = f * d - m * p, w = l * d - m * y, D = E * w - n * M + b * B + A * z - x * v + R * _, T = 1 / D;
    return D == 0 ? this.identity() : (this.elm[0] = (h * w - c * M + a * B) * T, this.elm[1] = (-e * w + s * M - i * B) * T, this.elm[2] = (p * R - y * x + d * A) * T, this.elm[3] = (-f * R + l * x - m * A) * T, this.elm[4] = (-r * w + c * z - a * v) * T, this.elm[5] = (t * w - s * z + i * v) * T, this.elm[6] = (-g * R + y * b - d * n) * T, this.elm[7] = (o * R - l * b + m * n) * T, this.elm[8] = (r * M - h * z + a * _) * T, this.elm[9] = (-t * M + e * z - i * _) * T, this.elm[10] = (g * x - p * b + d * E) * T, this.elm[11] = (-o * x + f * b - m * E) * T, this.elm[12] = (-r * B + h * v - c * _) * T, this.elm[13] = (t * B - e * v + s * _) * T, this.elm[14] = (-g * A + p * n - y * E) * T, this.elm[15] = (o * A - f * n + l * E) * T, this);
  }
  transpose() {
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], h = this.elm[5], c = this.elm[6], a = this.elm[7], o = this.elm[8], f = this.elm[9], l = this.elm[10], m = this.elm[11], g = this.elm[12], p = this.elm[13], y = this.elm[14], d = this.elm[15];
    return this.elm[0] = t, this.elm[1] = r, this.elm[2] = o, this.elm[3] = g, this.elm[4] = e, this.elm[5] = h, this.elm[6] = f, this.elm[7] = p, this.elm[8] = s, this.elm[9] = c, this.elm[10] = l, this.elm[11] = y, this.elm[12] = i, this.elm[13] = a, this.elm[14] = m, this.elm[15] = d, this;
  }
  set(t) {
    var e;
    for (let s = 0; s < this.elm.length; s++)
      this.elm[s] = (e = t[s]) != null ? e : 0;
    return this;
  }
  setFromTransform(t, e, s) {
    return this.identity(), this.applyPosition(t), this.applyQuaternion(e), this.applyScale(s), this;
  }
  applyPosition(t) {
    return this.matmul([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      t.x,
      t.y,
      t.z,
      1
    ]), this;
  }
  applyQuaternion(t) {
    const e = t.x, s = t.y, i = t.z, r = t.w, h = e * e, c = s * s, a = i * i, o = r * r, f = e * s, l = e * i, m = e * r, g = s * i, p = s * r, y = i * r;
    return this.matmul([
      h - c - a + o,
      2 * (f + y),
      2 * (l - p),
      0,
      2 * (f - y),
      -h + c - a + o,
      2 * (g + m),
      0,
      2 * (l + p),
      2 * (g - m),
      -h - c + a + o,
      0,
      0,
      0,
      0,
      1
    ]), this;
  }
  applyScale(t) {
    return this.matmul([
      t.x,
      0,
      0,
      0,
      0,
      t.y,
      0,
      0,
      0,
      0,
      t.z,
      0,
      0,
      0,
      0,
      1
    ]), this;
  }
  matmul(t) {
    const e = new Array(16);
    for (let s = 0; s < 4; s++)
      for (let i = 0; i < 4; i++) {
        let r = 0;
        for (let h = 0; h < 4; h++)
          r += this.elm[h * 4 + i] * t[h + s * 4];
        e[i + s * 4] = r;
      }
    this.elm = e;
  }
  multiply(t) {
    return this.matmul(t.elm), this;
  }
  preMultiply(t) {
    const e = this.copyToArray([]);
    return this.set(t.elm), this.matmul(e), this;
  }
  copyToArray(t) {
    t.length = this.elm.length;
    for (let e = 0; e < this.elm.length; e++)
      t[e] = this.elm[e];
    return t;
  }
}
class W {
  constructor(t, e, s, i) {
    this.x = 0, this.y = 0, this.z = 0, this.w = 1, this.set(t, e, s, i);
  }
  set(t, e, s, i) {
    this.x = t != null ? t : this.x, this.y = e != null ? e : this.y, this.z = s != null ? s : this.z, this.w = i != null ? i : this.w;
  }
  euler(t, e = "XYZ") {
    const s = Math.sin(t.x / 2), i = Math.sin(t.y / 2), r = Math.sin(t.z / 2), h = Math.cos(t.x / 2), c = Math.cos(t.y / 2), a = Math.cos(t.z / 2);
    return e == "XYZ" ? (this.x = h * i * r + s * c * a, this.y = -s * c * r + h * i * a, this.z = h * c * r + s * i * a, this.w = -s * i * r + h * c * a) : e == "XZY" ? (this.x = -h * i * r + s * c * a, this.y = h * i * a - s * c * r, this.z = s * i * a + h * c * r, this.w = s * i * r + h * c * a) : e == "YZX" ? (this.x = s * c * a + h * i * r, this.y = s * c * r + h * i * a, this.z = -s * i * a + h * c * r, this.w = -s * i * r + h * c * a) : e == "ZYX" && (this.x = s * c * a - h * i * r, this.y = s * c * r + h * i * a, this.z = -s * i * a + h * c * r, this.w = s * i * r + h * c * a), this;
  }
  multiply() {
  }
}
class U {
  constructor() {
    this.count = 0, this.attributes = {};
  }
  setAttribute(t, e, s) {
    this.attributes[t] = {
      array: e,
      size: s
    }, this.updateVertCount();
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  updateVertCount() {
    const t = Object.keys(this.attributes);
    this.count = t.length > 0 ? 1 / 0 : 0, t.forEach((e) => {
      const s = this.attributes[e];
      e != "index" && (this.count = Math.min(s.array.length / s.size, this.count));
    });
  }
  getAttributeBuffer(t, e, s, i = "vbo") {
    const r = this.getAttribute(e);
    return {
      buffer: t.createBuffer().setData(new s(r.array), i),
      size: r.size,
      count: r.array.length / r.size
    };
  }
  getComponent(t) {
    const e = [];
    return this.getAttribute("position") && e.push({ name: "position", ...this.getAttributeBuffer(t, "position", Float32Array) }), this.getAttribute("uv") && e.push({ name: "uv", ...this.getAttributeBuffer(t, "uv", Float32Array) }), this.getAttribute("normal") && e.push({ name: "normal", ...this.getAttributeBuffer(t, "normal", Float32Array) }), {
      attributes: e,
      index: this.getAttributeBuffer(t, "index", Uint16Array, "ibo")
    };
  }
}
class Y extends U {
  constructor(t = 1, e = 1, s = 1) {
    super();
    const i = t / 2, r = e / 2, h = s / 2, c = [
      -i,
      r,
      h,
      i,
      r,
      h,
      -i,
      -r,
      h,
      i,
      -r,
      h,
      i,
      r,
      -h,
      -i,
      r,
      -h,
      i,
      -r,
      -h,
      -i,
      -r,
      -h,
      i,
      r,
      h,
      i,
      r,
      -h,
      i,
      -r,
      h,
      i,
      -r,
      -h,
      -i,
      r,
      -h,
      -i,
      r,
      h,
      -i,
      -r,
      -h,
      -i,
      -r,
      h,
      -i,
      r,
      -h,
      i,
      r,
      -h,
      -i,
      r,
      h,
      i,
      r,
      h,
      -i,
      -r,
      h,
      i,
      -r,
      h,
      -i,
      -r,
      -h,
      i,
      -r,
      -h
    ], a = [
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0
    ], o = [], f = [];
    for (let l = 0; l < 6; l++) {
      o.push(
        0,
        1,
        1,
        1,
        0,
        0,
        1,
        0
      );
      const m = 4 * l;
      f.push(
        0 + m,
        2 + m,
        1 + m,
        1 + m,
        2 + m,
        3 + m
      );
    }
    this.setAttribute("position", c, 3), this.setAttribute("normal", a, 3), this.setAttribute("uv", o, 2), this.setAttribute("index", f, 1);
  }
}
class K extends U {
  constructor(t = 0.5, e = 0.5, s = 1, i = 10, r = 1) {
    super();
    const h = [], c = [], a = [], o = [];
    for (let f = 0; f <= r + 2; f++)
      for (let l = 0; l < i; l++) {
        const m = Math.PI * 2 / i * l;
        if (f <= r) {
          const g = f / r, p = (1 - g) * e + g * t, y = Math.cos(m) * p, d = -(s / 2) + s / r * f, E = Math.sin(m) * p;
          h.push(y, d, E), a.push(
            l / i,
            f / r
          );
          const n = new F(Math.cos(m), 0, Math.sin(m)).normalize();
          c.push(
            n.x,
            n.y,
            n.z
          ), f < r && o.push(
            f * i + l,
            (f + 1) * i + (l + 1) % i,
            f * i + (l + 1) % i,
            f * i + l,
            (f + 1) * i + l,
            (f + 1) * i + (l + 1) % i
          );
        } else {
          const g = f - r - 1, p = g ? t : e, y = Math.cos(m) * p, d = -(s / 2) + s * g, E = Math.sin(m) * p;
          h.push(y, d, E), a.push(
            (y + p) * 0.5 / p,
            (E + p) * 0.5 / p
          ), c.push(0, -1 + g * 2, 0);
          const n = i * (r + (g + 1));
          l <= i - 2 && (g == 0 ? o.push(
            n,
            n + l,
            n + l + 1
          ) : o.push(
            n,
            n + l + 1,
            n + l
          ));
        }
      }
    this.setAttribute("position", h, 3), this.setAttribute("normal", c, 3), this.setAttribute("uv", a, 2), this.setAttribute("index", o, 1);
  }
}
class q extends U {
  constructor(t = 1, e = 1, s = 1, i = 1) {
    super();
    const r = t / 2, h = e / 2, c = [], a = [], o = [], f = [];
    for (let l = 0; l <= i; l++)
      for (let m = 0; m <= s; m++) {
        const g = m / s, p = l / s;
        if (c.push(
          -r + t * g,
          -h + e * p,
          0
        ), o.push(g, p), a.push(0, 0, 1), l > 0 && m > 0) {
          const y = s + 1, d = y * l + m, E = y * (l - 1) + m - 1;
          f.push(
            d,
            y * l + m - 1,
            E,
            d,
            E,
            y * (l - 1) + m
          );
        }
      }
    this.setAttribute("position", c, 3), this.setAttribute("normal", a, 3), this.setAttribute("uv", o, 2), this.setAttribute("index", f, 1);
  }
}
class J extends U {
  constructor(t = 0.5, e = 20, s = 10) {
    super();
    const i = [], r = [], h = [], c = [];
    for (let a = 0; a <= s; a++) {
      const o = a / s * Math.PI, f = (a != 0 && a != s, e);
      for (let l = 0; l < f; l++) {
        const m = l / f * Math.PI * 2, g = Math.sin(o) * t, p = Math.cos(m) * g, y = -Math.cos(o) * t, d = -Math.sin(m) * g;
        i.push(p, y, d), h.push(
          l / f,
          a / s
        );
        const E = new F(p, y, d).normalize();
        r.push(E.x, E.y, E.z), c.push(
          a * e + l,
          a * e + (l + 1) % e,
          (a + 1) * e + (l + 1) % e,
          a * e + l,
          (a + 1) * e + (l + 1) % e,
          (a + 1) * e + l
        );
      }
    }
    this.setAttribute("position", i, 3), this.setAttribute("normal", r, 3), this.setAttribute("uv", h, 2), this.setAttribute("index", c, 1);
  }
  setAttribute(t, e, s) {
    t == "index" && e.forEach((i, r) => {
      e[r] = i % this.count;
    }), super.setAttribute(t, e, s);
  }
}
class $ extends U {
  constructor(t = 7) {
    super(), this.count = t;
    const e = [], s = [], i = [], r = new F(0, 0);
    let h = 1;
    for (let c = 0; c < t; c++) {
      e.push(-1 + r.x, 1 + r.y, 0), e.push(-1 + r.x + h, 1 + r.y, 0), e.push(-1 + r.x + h, 1 + r.y - h, 0), e.push(-1 + r.x, 1 + r.y - h, 0), s.push(0, 1), s.push(1, 1), s.push(1, 0), s.push(0, 0);
      const a = (c + 0) * 4;
      i.push(a + 0, a + 2, a + 1, a + 0, a + 3, a + 2), r.x += h, r.y = r.y - h, h *= 0.5;
    }
    this.setAttribute("position", e, 3), this.setAttribute("uv", s, 2), this.setAttribute("index", i, 1);
  }
}
var C;
((u) => {
  u.createWorld = () => ({
    elapsedTime: 0,
    lastUpdateTime: new Date().getTime(),
    entitiesTotalCount: 0,
    entities: [],
    components: /* @__PURE__ */ new Map(),
    systems: /* @__PURE__ */ new Map()
  }), u.createEntity = (t) => {
    const e = t.entitiesTotalCount++;
    return t.entities.push(e), e;
  }, u.removeEntity = (t, e) => {
    const s = t.entities.findIndex((i) => i == e);
    s > -1 && t.entities.slice(s, 1), t.components.forEach((i) => {
      i[e] = void 0;
    });
  }, u.addComponent = (t, e, s, i) => {
    let r = t.components.get(s);
    return r === void 0 && (r = [], t.components.set(s, r)), r.length < e + 1 && (r.length = e + 1), r[e] = i, i;
  }, u.removeComponent = (t, e, s) => {
    const i = t.components.get(s);
    i && i.length > e && (i[e] = void 0);
  }, u.getComponent = (t, e, s) => {
    const i = t.components.get(s);
    return i !== void 0 ? i[e] : null;
  }, u.addSystem = (t, e, s) => {
    t.systems.set(e, s);
  }, u.removeSystem = (t, e) => {
    t.systems.delete(e);
  }, u.update = (t) => {
    const e = new Date().getTime(), s = (e - t.lastUpdateTime) / 1e3;
    t.elapsedTime += s, t.lastUpdateTime = e, t.systems.forEach((r) => {
      r.update({
        world: t,
        deltaTime: s,
        time: t.elapsedTime
      });
    });
  }, u.getEntities = (t, e) => t.entities.filter((i) => {
    for (let r = 0; r < e.length; r++) {
      const h = e[r], c = t.components.get(h);
      if (c === void 0 || c[i] === void 0)
        return !1;
    }
    return !0;
  });
})(C || (C = {}));
class N {
  constructor() {
    this.listeners = [];
  }
  on(t, e) {
    this.listeners.push({
      event: t,
      cb: e
    });
  }
  once(t, e) {
    this.listeners.push({
      event: t,
      cb: e,
      once: !0
    });
  }
  off(t, e) {
    this.listeners = this.listeners.filter((s) => !(s.event == t && s.cb == e));
  }
  emit(t, e) {
    const s = this.listeners.concat();
    for (let i = 0; i < s.length; i++) {
      const r = s[i];
      r.event == t && (r.cb.apply(this, e || []), r.once && this.off(t, r.cb));
    }
  }
}
class tt extends N {
  constructor(t) {
    if (super(), this.queries = [], t) {
      const e = Object.keys(t);
      for (let s = 0; s < e.length; s++) {
        const i = e[s];
        this.queries.push({ name: i, query: t[i] });
      }
    }
  }
  update(t) {
    for (let e = 0; e < this.queries.length; e++) {
      const s = this.queries[e], i = C.getEntities(t.world, s.query);
      this.beforeUpdateImpl(s.name, t, i);
      for (let r = 0; r < i.length; r++)
        this.updateImpl(s.name, i[r], t);
      this.afterUpdateImpl(s.name, t);
    }
  }
  beforeUpdateImpl(t, e, s) {
  }
  updateImpl(t, e, s) {
  }
  afterUpdateImpl(t, e) {
  }
  dispose() {
    this.emit("dispose");
  }
}
var I;
((u) => {
  u.NEWTON_ITERATIONS = 4, u.NEWTON_MIN_SLOPE = 1e-3, u.SUBDIVISION_PRECISION = 1e-7, u.SUBDIVISION_MAX_ITERATIONS = 10, u.BEZIER_EASING_CACHE_SIZE = 11, u.BEZIER_EASING_SAMPLE_STEP_SIZE = 1 / u.BEZIER_EASING_CACHE_SIZE;
  function t(o) {
    return -o.p0 + 3 * o.p1 - 3 * o.p2 + o.p3;
  }
  function e(o) {
    return 3 * o.p0 - 6 * o.p1 + 3 * o.p2;
  }
  function s(o) {
    return -3 * o.p0 + 3 * o.p1;
  }
  function i(o, f) {
    return 3 * t(o) * f * f + 2 * e(o) * f + s(o);
  }
  u.calcBezierSlope = i;
  function r(o, f) {
    return ((t(o) * f + e(o)) * f + s(o)) * f + o.p0;
  }
  u.calcBezier = r;
  function h(o, f, l, m) {
    let g = 0, p = 0;
    for (let y = 0; y < u.SUBDIVISION_MAX_ITERATIONS; y++)
      p = f + (l - f) / 2, g = r(m, p), g > o ? l = p : f = p;
    return p;
  }
  function c(o, f, l) {
    for (let m = 0; m < u.NEWTON_ITERATIONS; m++) {
      const g = i(f, l);
      if (g == 0)
        return l;
      l -= (r(f, l) - o) / g;
    }
    return l;
  }
  function a(o, f, l) {
    o.p1 = Math.max(o.p0, Math.min(o.p3, o.p1)), o.p2 = Math.max(o.p0, Math.min(o.p3, o.p2));
    let m = 0;
    for (let y = 1; y < l.length && (m = y - 1, !(f < l[y])); y++)
      ;
    const g = m / (u.BEZIER_EASING_CACHE_SIZE - 1), p = i(o, g) / (o.p3 - o.p0);
    return p == 0 ? g : p > 0.01 ? c(f, o, g) : h(f, g, g + u.BEZIER_EASING_SAMPLE_STEP_SIZE, o);
  }
  u.getBezierTfromX = a;
})(I || (I = {}));
var S;
((u) => {
  function t(n = 6) {
    return (b) => {
      var A = Math.exp(-n * (2 * b - 1)), x = Math.exp(-n);
      return (1 + (1 - A) / (1 + A) * (1 + x) / (1 - x)) / 2;
    };
  }
  u.sigmoid = t;
  function e(n, b, A) {
    const x = Math.max(0, Math.min(1, (A - n) / (b - n)));
    return x * x * (3 - 2 * x);
  }
  u.smoothstep = e;
  function s(n) {
    return n;
  }
  u.linear = s;
  function i(n) {
    return n * n;
  }
  u.easeInQuad = i;
  function r(n) {
    return n * (2 - n);
  }
  u.easeOutQuad = r;
  function h(n) {
    return n < 0.5 ? 2 * n * n : -1 + (4 - 2 * n) * n;
  }
  u.easeInOutQuad = h;
  function c(n) {
    return n * n * n;
  }
  u.easeInCubic = c;
  function a(n) {
    return --n * n * n + 1;
  }
  u.easeOutCubic = a;
  function o(n) {
    return n < 0.5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1;
  }
  u.easeInOutCubic = o;
  function f(n) {
    return n * n * n * n;
  }
  u.easeInQuart = f;
  function l(n) {
    return 1 - --n * n * n * n;
  }
  u.easeOutQuart = l;
  function m(n) {
    return n < 0.5 ? 8 * n * n * n * n : 1 - 8 * --n * n * n * n;
  }
  u.easeInOutQuart = m;
  function g(n) {
    return n * n * n * n * n;
  }
  u.easeInQuint = g;
  function p(n) {
    return 1 + --n * n * n * n * n;
  }
  u.easeOutQuint = p;
  function y(n) {
    return n < 0.5 ? 16 * n * n * n * n * n : 1 + 16 * --n * n * n * n * n;
  }
  u.easeInOutQuint = y;
  function d(n, b, A, x) {
    for (var R = new Array(I.BEZIER_EASING_CACHE_SIZE), _ = 0; _ < I.BEZIER_EASING_CACHE_SIZE; ++_)
      R[_] = I.calcBezier({ p0: n.x, p1: b.x, p2: A.x, p3: x.x }, _ / (I.BEZIER_EASING_CACHE_SIZE - 1));
    return (v) => v <= n.x ? n.y : x.x <= v ? x.y : I.calcBezier({ p0: n.y, p1: b.y, p2: A.y, p3: x.y }, I.getBezierTfromX({ p0: n.x, p1: b.x, p2: A.x, p3: x.x }, v, R));
  }
  u.bezier = d;
  function E(n, b, A, x) {
    return d(
      { x: 0, y: 0 },
      { x: n, y: b },
      { x: A, y: x },
      { x: 1, y: 1 }
    );
  }
  u.cubicBezier = E;
})(S || (S = {}));
class V extends N {
  constructor(t) {
    super(), this.keyframes = [], this.cache = { frame: NaN, value: NaN }, this.frameStart = 0, this.frameEnd = 0, this.frameDuration = 0, this.set(t);
  }
  set(t) {
    t && (this.keyframes.length = 0, t.forEach((e) => {
      this.addKeyFrame(e);
    }));
  }
  addKeyFrame(t) {
    let e = 0;
    for (let s = 0; s < this.keyframes.length && this.keyframes[s].coordinate.x < t.coordinate.x; s++)
      e++;
    this.keyframes.splice(e, 0, t), this.frameStart = this.keyframes[0].coordinate.x, this.frameEnd = this.keyframes[this.keyframes.length - 1].coordinate.x;
  }
  getValue(t) {
    if (t == this.cache.frame)
      return this.cache.value;
    let e = null;
    for (let s = 0; s < this.keyframes.length; s++) {
      const i = this.keyframes[s];
      if (t <= i.coordinate.x) {
        const r = this.keyframes[s - 1];
        r ? e = r.to(i, t) : e = i.coordinate.y;
        break;
      }
    }
    return e === null && this.keyframes.length > 0 && (e = this.keyframes[this.keyframes.length - 1].coordinate.y), e !== null ? (this.cache = {
      frame: t,
      value: e
    }, e) : 0;
  }
}
class Z extends N {
  constructor(t, e, s, i, r) {
    super(), this.updatedFrame = -1, this.name = t || "", this.frameStart = 0, this.frameEnd = 0, this.frameDuration = 0, this.curves = /* @__PURE__ */ new Map(), this.value = new F(), e && this.setFCurve(e, "x"), s && this.setFCurve(s, "y"), i && this.setFCurve(i, "z"), r && this.setFCurve(r, "w");
  }
  setFCurve(t, e) {
    this.curves.set(e, t);
    let s = 1 / 0, i = -1 / 0;
    this.curves.forEach((r) => {
      r.frameStart < s && (s = r.frameStart), r.frameEnd > i && (i = r.frameEnd);
    }), (s == -1 / 0 || i == 1 / 0) && (s = 0, i = 1), this.frameStart = s, this.frameEnd = i, this.frameDuration = this.frameEnd - this.frameStart;
  }
  getFCurve(t) {
    return this.curves.get(t) || null;
  }
  setFrame(t) {
    if (t == this.updatedFrame)
      return this;
    const e = this.curves.get("x"), s = this.curves.get("y"), i = this.curves.get("z"), r = this.curves.get("w");
    return e && (this.value.x = e.getValue(t)), s && (this.value.y = s.getValue(t)), i && (this.value.z = i.getValue(t)), r && (this.value.w = r.getValue(t)), this.updatedFrame = t, this;
  }
}
class Q extends N {
  constructor(t, e, s, i) {
    super(), this.coordinate = { x: 0, y: 0 }, this.handleLeft = { x: 0, y: 0 }, this.handleRight = { x: 0, y: 0 }, this.interpolation = "BEZIER", this.easing = null, this.nextFrame = null, this.set(t, e, s, i);
  }
  set(t, e, s, i) {
    this.coordinate = t, this.handleLeft = e || t, this.handleRight = s || t, this.interpolation = i || "BEZIER";
  }
  getEasing(t, e) {
    return t == "BEZIER" ? S.bezier(this.coordinate, this.handleRight, e.handleLeft, e.coordinate) : t == "CONSTANT" ? () => this.coordinate.y : (s) => {
      const i = e.coordinate.y - this.coordinate.y;
      return s = (s - this.coordinate.x) / (e.coordinate.x - this.coordinate.x), this.coordinate.y + s * i;
    };
  }
  to(t, e) {
    return (this.nextFrame == null || this.nextFrame.coordinate.x != t.coordinate.x || this.nextFrame.coordinate.y != t.coordinate.y) && (this.easing = this.getEasing(this.interpolation, t), this.nextFrame = t), this.easing ? this.easing(e) : 0;
  }
}
class et extends N {
  constructor(t) {
    super(), this.connected = !1, this.frame = {
      start: -1,
      end: -1,
      current: -1,
      fps: -1,
      playing: !1
    }, this.objects = [], this.curveGroups = [], this.scene = null, t && (this.url = t, this.connect(this.url));
  }
  connect(t) {
    this.url = t, this.ws = new WebSocket(this.url), this.ws.onopen = this.onOpen.bind(this), this.ws.onmessage = this.onMessage.bind(this), this.ws.onclose = this.onClose.bind(this), this.ws.onerror = (e) => {
      console.error(e), this.emit("error");
    };
  }
  syncJsonScene(t) {
    const e = new XMLHttpRequest();
    e.onreadystatechange = () => {
      e.readyState == 4 && e.status == 200 && this.onSyncScene(JSON.parse(e.response));
    }, e.open("GET", t), e.send();
  }
  onSyncScene(t) {
    this.frame.start = t.frame.start, this.frame.end = t.frame.end, this.frame.fps = t.frame.fps, this.curveGroups.length = 0, this.objects.length = 0;
    const e = Object.keys(t.animations);
    for (let i = 0; i < e.length; i++) {
      const r = e[i], h = new Z(r);
      t.animations[r].forEach((c) => {
        const a = new V();
        a.set(c.keyframes.map((o) => new Q(o.c, o.h_l, o.h_r, o.i))), h.setFCurve(a, c.axis);
      }), this.curveGroups.push(h);
    }
    this.scene = t.scene, this.objects.length = 0;
    const s = (i) => {
      this.objects.push(i), i.children.forEach((r) => s(r));
    };
    s(this.scene), this.emit("sync/scene", [this]);
  }
  onSyncTimeline(t) {
    this.frame = t, this.emit("sync/timeline", [this.frame]);
  }
  onOpen(t) {
    this.connected = !0;
  }
  onMessage(t) {
    const e = JSON.parse(t.data);
    e.type == "sync/scene" ? this.onSyncScene(e.data) : e.type == "sync/timeline" && this.onSyncTimeline(e.data);
  }
  onClose(t) {
    this.disposeWS();
  }
  getCurveGroup(t) {
    return this.curveGroups.find((e) => e.name == t);
  }
  dispose() {
    this.disposeWS();
  }
  disposeWS() {
    this.ws && (this.ws.close(), this.ws.onmessage = null, this.ws.onclose = null, this.ws.onopen = null, this.connected = !1);
  }
}
export {
  et as BLidge,
  I as Bezier,
  Y as CubeGeometry,
  K as CylinderGeometry,
  C as ECS,
  S as Easings,
  N as EventEmitter,
  V as FCurve,
  Z as FCurveGroup,
  Q as FCurveKeyFrame,
  k as GLPowerBuffer,
  G as GLPowerFrameBuffer,
  L as GLPowerProgram,
  X as GLPowerTexture,
  j as GLPowerTransformFeedback,
  P as GLPowerVAO,
  U as Geometry,
  O as Matrix,
  $ as MipMapGeometry,
  q as PlaneGeometry,
  H as Power,
  W as Quaternion,
  J as SphereGeometry,
  tt as System,
  F as Vector
};
//# sourceMappingURL=glpower.js.map
