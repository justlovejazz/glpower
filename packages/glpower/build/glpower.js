class Y {
  constructor(t, e) {
    this.gl = t, this.program = e, this.vao = this.gl.createVertexArray(), this.attributes = /* @__PURE__ */ new Map(), this.indexBuffer = null, this.vertCount = 0, this.indexCount = 0, this.instanceCount = 0;
  }
  setAttribute(t, e, s, i) {
    const r = this.attributes.get(t), o = e.array ? e.array.length / s : 0;
    return this.attributes.set(t, {
      ...r,
      buffer: e,
      size: s,
      count: o,
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
  dispose() {
    this.attributes.forEach((t) => {
      t.buffer.dispose();
    });
  }
}
class K {
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
    if (!s)
      return null;
    if (this.gl.shaderSource(s, t), this.gl.compileShader(s), this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
      return s;
    {
      console.error(this.gl.getShaderInfoLog(s));
      let i = "";
      t.split(`
`).forEach((r, o) => {
        i += `${o + 1}: ${r}
`;
      }), console.error(i);
    }
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
    return e || (e = new Y(this.gl, this.program), this.vao.set(t, e), e);
  }
  use(t) {
    !this.program || (this.gl.useProgram(this.program), t && t(this), this.gl.useProgram(null));
  }
  getProgram() {
    return this.program;
  }
  dispose() {
    this.vao.forEach((t) => {
      t.dispose();
    }), this.vao.clear(), this.gl.deleteProgram(this.program);
  }
}
class J {
  constructor(t) {
    this.gl = t, this.buffer = this.gl.createBuffer(), this.array = null;
  }
  setData(t, e = "vbo", s) {
    const i = e == "vbo" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    return this.gl.bindBuffer(i, this.buffer), this.gl.bufferData(i, t, s || this.gl.STATIC_DRAW), this.gl.bindBuffer(i, null), this.array = t, this;
  }
  dispose() {
    this.gl.deleteBuffer(this.buffer);
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
    const e = this.x, s = this.y, i = this.z, r = t.x, o = t.y, u = t.z;
    return this.x = s * u - i * o, this.y = i * r - e * u, this.z = e * o - s * r, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  applyMatrix3(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], o = e[4], u = e[5], a = e[6], h = e[8], c = e[9], l = e[10], p = this.x * s + this.y * o + this.z * h, g = this.x * i + this.y * u + this.z * c, m = this.x * r + this.y * a + this.z * l;
    this.x = p, this.y = g, this.z = m, this.w = 0;
  }
  applyMatrix4(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], o = e[3], u = e[4], a = e[5], h = e[6], c = e[7], l = e[8], p = e[9], g = e[10], m = e[11], y = e[12], d = e[13], x = e[14], n = e[15], E = this.x * s + this.y * u + this.z * l + this.w * y, b = this.x * i + this.y * a + this.z * p + this.w * d, A = this.x * r + this.y * h + this.z * g + this.w * x, _ = this.x * o + this.y * c + this.z * m + this.w * n;
    return this.x = E, this.y = b, this.z = A, this.w = _, this;
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
class j {
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
  dispose() {
    this.gl.deleteTexture(this.texture);
  }
}
class $ {
  constructor(t, e) {
    this.gl = t, this.size = new F(1, 1), this.frameBuffer = this.gl.createFramebuffer(), this.depthRenderBuffer = null, this.textures = [], this.textureAttachmentList = [], (!e || !e.disableDepthBuffer) && this.setDepthBuffer(this.gl.createRenderbuffer());
  }
  setDepthBuffer(t) {
    this.depthRenderBuffer = t, this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer), this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
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
  dispose() {
    this.gl.deleteFramebuffer(this.frameBuffer), this.gl.deleteRenderbuffer(this.depthRenderBuffer);
  }
}
class st {
  constructor(t) {
    this.gl = t, this.gl.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0), this.gl.getExtension("EXT_color_buffer_float"), this.gl.getExtension("EXT_color_buffer_half_float"), this.extDisJointTimerQuery = this.gl.getExtension("EXT_disjoint_timer_query_webgl2");
  }
  createProgram() {
    return new K(this.gl);
  }
  createBuffer() {
    return new J(this.gl);
  }
  createTexture() {
    return new j(this.gl);
  }
  createFrameBuffer() {
    return new $(this.gl);
  }
}
class it {
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
class k {
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
    return new k().copy(this);
  }
  copy(t) {
    return this.set(t.elm), this;
  }
  perspective(t, e, s, i) {
    var r = 1 / Math.tan(t * Math.PI / 360), o = i - s;
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
      -(i + s) / o,
      -1,
      0,
      0,
      -(i * s * 2) / o,
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
    const i = t.clone().sub(e).normalize(), r = s.clone().cross(i).normalize(), o = i.clone().cross(r).normalize();
    return this.elm = [
      r.x,
      r.y,
      r.z,
      0,
      o.x,
      o.y,
      o.z,
      0,
      i.x,
      i.y,
      i.z,
      0,
      t.x,
      t.y,
      t.z,
      1
    ], this;
  }
  inverse() {
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], o = this.elm[5], u = this.elm[6], a = this.elm[7], h = this.elm[8], c = this.elm[9], l = this.elm[10], p = this.elm[11], g = this.elm[12], m = this.elm[13], y = this.elm[14], d = this.elm[15], x = t * o - e * r, n = t * u - s * r, E = t * a - i * r, b = e * u - s * o, A = e * a - i * o, _ = s * a - i * u, z = h * m - c * g, I = h * y - l * g, R = h * d - p * g, v = c * y - l * m, B = c * d - p * m, w = l * d - p * y, U = x * w - n * B + E * v + b * R - A * I + _ * z, T = 1 / U;
    return U == 0 ? this.identity() : (this.elm[0] = (o * w - u * B + a * v) * T, this.elm[1] = (-e * w + s * B - i * v) * T, this.elm[2] = (m * _ - y * A + d * b) * T, this.elm[3] = (-c * _ + l * A - p * b) * T, this.elm[4] = (-r * w + u * R - a * I) * T, this.elm[5] = (t * w - s * R + i * I) * T, this.elm[6] = (-g * _ + y * E - d * n) * T, this.elm[7] = (h * _ - l * E + p * n) * T, this.elm[8] = (r * B - o * R + a * z) * T, this.elm[9] = (-t * B + e * R - i * z) * T, this.elm[10] = (g * A - m * E + d * x) * T, this.elm[11] = (-h * A + c * E - p * x) * T, this.elm[12] = (-r * v + o * I - u * z) * T, this.elm[13] = (t * v - e * I + s * z) * T, this.elm[14] = (-g * b + m * n - y * x) * T, this.elm[15] = (h * b - c * n + l * x) * T, this);
  }
  transpose() {
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], o = this.elm[5], u = this.elm[6], a = this.elm[7], h = this.elm[8], c = this.elm[9], l = this.elm[10], p = this.elm[11], g = this.elm[12], m = this.elm[13], y = this.elm[14], d = this.elm[15];
    return this.elm[0] = t, this.elm[1] = r, this.elm[2] = h, this.elm[3] = g, this.elm[4] = e, this.elm[5] = o, this.elm[6] = c, this.elm[7] = m, this.elm[8] = s, this.elm[9] = u, this.elm[10] = l, this.elm[11] = y, this.elm[12] = i, this.elm[13] = a, this.elm[14] = p, this.elm[15] = d, this;
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
    const e = t.x, s = t.y, i = t.z, r = t.w, o = e * e, u = s * s, a = i * i, h = r * r, c = e * s, l = e * i, p = e * r, g = s * i, m = s * r, y = i * r;
    return this.matmul([
      o - u - a + h,
      2 * (c + y),
      2 * (l - m),
      0,
      2 * (c - y),
      -o + u - a + h,
      2 * (g + p),
      0,
      2 * (l + m),
      2 * (g - p),
      -o - u + a + h,
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
        for (let o = 0; o < 4; o++)
          r += this.elm[o * 4 + i] * t[o + s * 4];
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
  decompose(t, e, s) {
    t && (t.x = this.elm[12], t.y = this.elm[13], t.z = this.elm[14]), e && e.setFromMatrix(this);
  }
  copyToArray(t) {
    t.length = this.elm.length;
    for (let e = 0; e < this.elm.length; e++)
      t[e] = this.elm[e];
    return t;
  }
}
class X {
  constructor(t, e, s, i) {
    this.x = 0, this.y = 0, this.z = 0, this.w = 1, this.set(t, e, s, i);
  }
  set(t, e, s, i) {
    this.x = t != null ? t : this.x, this.y = e != null ? e : this.y, this.z = s != null ? s : this.z, this.w = i != null ? i : this.w;
  }
  setFromEuler(t, e = "XYZ") {
    const s = Math.sin(t.x / 2), i = Math.sin(t.y / 2), r = Math.sin(t.z / 2), o = Math.cos(t.x / 2), u = Math.cos(t.y / 2), a = Math.cos(t.z / 2);
    return e == "XYZ" ? (this.x = o * i * r + s * u * a, this.y = -s * u * r + o * i * a, this.z = o * u * r + s * i * a, this.w = -s * i * r + o * u * a) : e == "XZY" ? (this.x = -o * i * r + s * u * a, this.y = o * i * a - s * u * r, this.z = s * i * a + o * u * r, this.w = s * i * r + o * u * a) : e == "YZX" ? (this.x = s * u * a + o * i * r, this.y = s * u * r + o * i * a, this.z = -s * i * a + o * u * r, this.w = -s * i * r + o * u * a) : e == "ZYX" && (this.x = s * u * a - o * i * r, this.y = s * u * r + o * i * a, this.z = -s * i * a + o * u * r, this.w = s * i * r + o * u * a), this;
  }
  setFromMatrix(t) {
    const e = t.elm, s = e[0] + e[5] + e[10];
    let i, r, o, u;
    if (s > 0) {
      const h = Math.sqrt(s + 1) * 2;
      u = 0.25 * h, i = (e[6] - e[9]) / h, r = (e[8] - e[2]) / h, o = (e[1] - e[4]) / h;
    } else if (e[0] > e[5] && e[0] > e[10]) {
      const h = Math.sqrt(1 + e[0] - e[5] - e[10]) * 2;
      u = (e[6] - e[9]) / h, i = 0.25 * h, r = (e[1] + e[4]) / h, o = (e[2] + e[8]) / h;
    } else if (e[5] > e[10]) {
      const h = Math.sqrt(1 + e[5] - e[0] - e[10]) * 2;
      u = (e[8] - e[2]) / h, i = (e[1] + e[4]) / h, r = 0.25 * h, o = (e[6] + e[9]) / h;
    } else {
      const h = Math.sqrt(1 + e[10] - e[0] - e[5]) * 2;
      u = (e[1] - e[4]) / h, i = (e[2] + e[8]) / h, r = (e[6] + e[9]) / h, o = 0.25 * h;
    }
    const a = Math.sqrt(i * i + r * r + o * o + u * u);
    return i /= a, r /= a, o /= a, u /= a, this.x = i, this.y = r, this.z = o, this.w = u, this;
  }
  multiply(t) {
    const e = this.w * t.w - this.x * t.x - this.y * t.y - this.z * t.z, s = this.w * t.x + this.x * t.w + this.y * t.z - this.z * t.y, i = this.w * t.y - this.x * t.z + this.y * t.w + this.z * t.x, r = this.w * t.z + this.x * t.y - this.y * t.x + this.z * t.w;
    return this.set(s, i, r, e), this;
  }
  inverse() {
    return this.set(-this.x, -this.y, -this.z, this.w), this;
  }
  copy(t) {
    var e, s, i, r;
    return this.x = (e = t.x) != null ? e : 0, this.y = (s = t.y) != null ? s : 0, this.z = (i = t.z) != null ? i : 0, this.w = (r = t.w) != null ? r : 0, this;
  }
  clone() {
    return new X(this.x, this.y, this.z, this.w);
  }
}
class C {
  constructor() {
    this.count = 0, this.attributes = {};
  }
  setAttribute(t, e, s) {
    return this.attributes[t] = {
      array: e,
      size: s
    }, this.updateVertCount(), this;
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
class rt extends C {
  constructor(t = 1, e = 1, s = 1, i = 1, r = 1, o = 1) {
    super();
    const u = [], a = [], h = [], c = [], l = [], p = [
      { normal: [0, 0, 1], dir: [1, 0, 0], up: [0, 1, 0], w: t, h: e, d: s, segW: i, segH: r },
      { normal: [0, 0, -1], dir: [-1, 0, 0], up: [0, 1, 0], w: t, h: e, d: s, segW: i, segH: r },
      { normal: [1, 0, 0], dir: [0, 0, -1], up: [0, 1, 0], w: s, h: e, d: t, segW: o, segH: r },
      { normal: [-1, 0, 0], dir: [0, 0, 1], up: [0, 1, 0], w: s, h: e, d: t, segW: o, segH: r },
      { normal: [0, 1, 0], dir: [-1, 0, 0], up: [0, 0, 1], w: t, h: s, d: e, segW: i, segH: o },
      { normal: [0, -1, 0], dir: [-1, 0, 0], up: [0, 0, -1], w: t, h: s, d: e, segW: i, segH: o }
    ];
    let g = 0;
    for (const m of p) {
      const y = m.normal, d = m.dir, x = m.up, n = m.segW, E = m.segH, b = m.w / 2, A = m.h / 2, _ = m.d / 2, z = m.w / n, I = m.h / E;
      for (let R = 0; R <= E; R++)
        for (let v = 0; v <= n; v++) {
          const B = -b + v * z, w = -A + R * I, U = -_, T = v / n, G = R / E, V = B * -d[0] + w * x[0] + U * -y[0], Z = B * -d[1] + w * x[1] + U * -y[1], Q = B * -d[2] + w * x[2] + U * -y[2];
          if (u.push(V, Z, Q), a.push(...y), h.push(T, G), l.push(
            R / E * x[1] + Math.max(0, x[2])
          ), R < E && v < n) {
            const H = g + R * (n + 1) + v, P = g + (R + 1) * (n + 1) + v, W = g + (R + 1) * (n + 1) + (v + 1), L = g + R * (n + 1) + (v + 1);
            c.push(H, P, L), c.push(P, W, L);
          }
        }
      g += (n + 1) * (E + 1);
    }
    this.setAttribute("position", u, 3), this.setAttribute("normal", a, 3), this.setAttribute("uv", h, 2), this.setAttribute("posY", l, 1), this.setAttribute("index", c, 1);
  }
  getComponent(t) {
    const e = super.getComponent(t);
    return e.attributes.push({
      name: "posY",
      ...this.getAttributeBuffer(t, "posY", Float32Array)
    }), e;
  }
}
class nt extends C {
  constructor(t = 0.5, e = 0.5, s = 1, i = 10, r = 1) {
    super();
    const o = [], u = [], a = [], h = [];
    for (let c = 0; c <= r + 2; c++)
      for (let l = 0; l < i; l++) {
        const p = Math.PI * 2 / i * l;
        if (c <= r) {
          const g = c / r, m = (1 - g) * e + g * t, y = Math.cos(p) * m, d = -(s / 2) + s / r * c, x = Math.sin(p) * m;
          o.push(y, d, x), a.push(
            l / i,
            c / r
          );
          const n = new F(Math.cos(p), 0, Math.sin(p)).normalize();
          u.push(
            n.x,
            n.y,
            n.z
          ), c < r && h.push(
            c * i + l,
            (c + 1) * i + (l + 1) % i,
            c * i + (l + 1) % i,
            c * i + l,
            (c + 1) * i + l,
            (c + 1) * i + (l + 1) % i
          );
        } else {
          const g = c - r - 1, m = g ? t : e, y = Math.cos(p) * m, d = -(s / 2) + s * g, x = Math.sin(p) * m;
          o.push(y, d, x), a.push(
            (y + m) * 0.5 / m,
            (x + m) * 0.5 / m
          ), u.push(0, -1 + g * 2, 0);
          const n = i * (r + (g + 1));
          l <= i - 2 && (g == 0 ? h.push(
            n,
            n + l,
            n + l + 1
          ) : h.push(
            n,
            n + l + 1,
            n + l
          ));
        }
      }
    this.setAttribute("position", o, 3), this.setAttribute("normal", u, 3), this.setAttribute("uv", a, 2), this.setAttribute("index", h, 1);
  }
}
class ht extends C {
  constructor(t = 1, e = 1, s = 1, i = 1) {
    super();
    const r = t / 2, o = e / 2, u = [], a = [], h = [], c = [];
    for (let l = 0; l <= i; l++)
      for (let p = 0; p <= s; p++) {
        const g = p / s, m = l / s;
        if (u.push(
          -r + t * g,
          -o + e * m,
          0
        ), h.push(g, m), a.push(0, 0, 1), l > 0 && p > 0) {
          const y = s + 1, d = y * l + p, x = y * (l - 1) + p - 1;
          c.push(
            d,
            y * l + p - 1,
            x,
            d,
            x,
            y * (l - 1) + p
          );
        }
      }
    this.setAttribute("position", u, 3), this.setAttribute("normal", a, 3), this.setAttribute("uv", h, 2), this.setAttribute("index", c, 1);
  }
}
class ot extends C {
  constructor(t = 0.5, e = 20, s = 10) {
    super();
    const i = [], r = [], o = [], u = [];
    for (let a = 0; a <= s; a++) {
      const h = a / s * Math.PI, c = (a != 0 && a != s, e);
      for (let l = 0; l < c; l++) {
        const p = l / c * Math.PI * 2, g = Math.sin(h) * t, m = Math.cos(p) * g, y = -Math.cos(h) * t, d = -Math.sin(p) * g;
        i.push(m, y, d), o.push(
          l / c,
          a / s
        );
        const x = new F(m, y, d).normalize();
        r.push(x.x, x.y, x.z), u.push(
          a * e + l,
          a * e + (l + 1) % e,
          (a + 1) * e + (l + 1) % e,
          a * e + l,
          (a + 1) * e + (l + 1) % e,
          (a + 1) * e + l
        );
      }
    }
    this.setAttribute("position", i, 3), this.setAttribute("normal", r, 3), this.setAttribute("uv", o, 2), this.setAttribute("index", u, 1);
  }
  setAttribute(t, e, s) {
    return t == "index" && e.forEach((i, r) => {
      e[r] = i % this.count;
    }), super.setAttribute(t, e, s);
  }
}
class at extends C {
  constructor(t = 1, e = 0.4, s = 30, i = 20) {
    super();
    const r = [], o = [], u = [], a = [];
    for (let h = 0; h <= s; h++) {
      const c = h / s * Math.PI * 2;
      for (let l = 0; l <= i; l++) {
        const p = l / i * Math.PI * 2, g = (t + e * Math.cos(p)) * Math.cos(c), m = e * Math.sin(p), y = (t + e * Math.cos(p)) * Math.sin(c);
        r.push(g, m, y), u.push(
          h / s,
          l / i
        );
        const d = new F(
          Math.cos(c) * Math.cos(p),
          Math.sin(c) * Math.cos(p),
          Math.sin(p)
        );
        if (o.push(d.x, d.y, d.z), h < s && l < i) {
          const x = h * (i + 1) + l, n = h * (i + 1) + l + 1, E = (h + 1) * (i + 1) + l + 1, b = (h + 1) * (i + 1) + l;
          a.push(x, n, E, x, E, b);
        }
      }
    }
    this.setAttribute("position", r, 3), this.setAttribute("normal", o, 3), this.setAttribute("uv", u, 2), this.setAttribute("index", a, 1);
  }
}
class lt extends C {
  constructor(t = 7) {
    super(), this.count = t;
    const e = [], s = [], i = [], r = new F(0, 0);
    let o = 1;
    for (let u = 0; u < t; u++) {
      e.push(-1 + r.x, 1 + r.y, 0), e.push(-1 + r.x + o, 1 + r.y, 0), e.push(-1 + r.x + o, 1 + r.y - o, 0), e.push(-1 + r.x, 1 + r.y - o, 0), s.push(0, 1), s.push(1, 1), s.push(1, 0), s.push(0, 0);
      const a = (u + 0) * 4;
      i.push(a + 0, a + 2, a + 1, a + 0, a + 3, a + 2), r.x += o, r.y = r.y - o, o *= 0.5;
    }
    this.setAttribute("position", e, 3), this.setAttribute("uv", s, 2), this.setAttribute("index", i, 1);
  }
}
var O;
((f) => {
  f.createWorld = () => ({
    elapsedTime: 0,
    lastUpdateTime: new Date().getTime(),
    entitiesTotalCount: 0,
    entities: [],
    components: /* @__PURE__ */ new Map(),
    systems: /* @__PURE__ */ new Map()
  }), f.createEntity = (t) => {
    const e = t.entitiesTotalCount++;
    return t.entities.push(e), e;
  }, f.removeEntity = (t, e) => {
    const s = t.entities.findIndex((i) => i == e);
    s > -1 && t.entities.slice(s, 1), t.components.forEach((i) => {
      i[e] = void 0;
    });
  }, f.addComponent = (t, e, s, i) => {
    let r = t.components.get(s);
    return r === void 0 && (r = [], t.components.set(s, r)), r.length < e + 1 && (r.length = e + 1), r[e] = i, i;
  }, f.removeComponent = (t, e, s) => {
    const i = t.components.get(s);
    i && i.length > e && (i[e] = void 0);
  }, f.getComponent = (t, e, s) => {
    const i = t.components.get(s);
    return i !== void 0 ? i[e] : null;
  }, f.addSystem = (t, e, s) => {
    t.systems.set(e, s);
  }, f.removeSystem = (t, e) => {
    t.systems.delete(e);
  }, f.update = (t) => {
    const e = new Date().getTime(), s = (e - t.lastUpdateTime) / 1e3;
    t.elapsedTime += s, t.lastUpdateTime = e, t.systems.forEach((r, o) => {
      r.update({
        systemName: o,
        world: t,
        deltaTime: s,
        time: t.elapsedTime
      });
    });
  }, f.getEntities = (t, e) => t.entities.filter((i) => {
    for (let r = 0; r < e.length; r++) {
      const o = e[r], u = t.components.get(o);
      if (u === void 0 || u[i] === void 0)
        return !1;
    }
    return !0;
  });
})(O || (O = {}));
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
class ut extends N {
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
      const s = this.queries[e], i = O.getEntities(t.world, s.query);
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
var M;
((f) => {
  f.NEWTON_ITERATIONS = 4, f.NEWTON_MIN_SLOPE = 1e-3, f.SUBDIVISION_PRECISION = 1e-7, f.SUBDIVISION_MAX_ITERATIONS = 10, f.BEZIER_EASING_CACHE_SIZE = 11, f.BEZIER_EASING_SAMPLE_STEP_SIZE = 1 / f.BEZIER_EASING_CACHE_SIZE;
  function t(h) {
    return -h.p0 + 3 * h.p1 - 3 * h.p2 + h.p3;
  }
  function e(h) {
    return 3 * h.p0 - 6 * h.p1 + 3 * h.p2;
  }
  function s(h) {
    return -3 * h.p0 + 3 * h.p1;
  }
  function i(h, c) {
    return 3 * t(h) * c * c + 2 * e(h) * c + s(h);
  }
  f.calcBezierSlope = i;
  function r(h, c) {
    return ((t(h) * c + e(h)) * c + s(h)) * c + h.p0;
  }
  f.calcBezier = r;
  function o(h, c, l, p) {
    let g = 0, m = 0;
    for (let y = 0; y < f.SUBDIVISION_MAX_ITERATIONS; y++)
      m = c + (l - c) / 2, g = r(p, m), g > h ? l = m : c = m;
    return m;
  }
  function u(h, c, l) {
    for (let p = 0; p < f.NEWTON_ITERATIONS; p++) {
      const g = i(c, l);
      if (g == 0)
        return l;
      l -= (r(c, l) - h) / g;
    }
    return l;
  }
  function a(h, c, l) {
    h.p1 = Math.max(h.p0, Math.min(h.p3, h.p1)), h.p2 = Math.max(h.p0, Math.min(h.p3, h.p2));
    let p = 0;
    for (let y = 1; y < l.length && (p = y - 1, !(c < l[y])); y++)
      ;
    const g = p / (f.BEZIER_EASING_CACHE_SIZE - 1), m = i(h, g) / (h.p3 - h.p0);
    return m == 0 ? g : m > 0.01 ? u(c, h, g) : o(c, g, g + f.BEZIER_EASING_SAMPLE_STEP_SIZE, h);
  }
  f.getBezierTfromX = a;
})(M || (M = {}));
var D;
((f) => {
  function t(n = 6) {
    return (E) => {
      var b = Math.exp(-n * (2 * E - 1)), A = Math.exp(-n);
      return (1 + (1 - b) / (1 + b) * (1 + A) / (1 - A)) / 2;
    };
  }
  f.sigmoid = t;
  function e(n, E, b) {
    const A = Math.max(0, Math.min(1, (b - n) / (E - n)));
    return A * A * (3 - 2 * A);
  }
  f.smoothstep = e;
  function s(n) {
    return n;
  }
  f.linear = s;
  function i(n) {
    return n * n;
  }
  f.easeInQuad = i;
  function r(n) {
    return n * (2 - n);
  }
  f.easeOutQuad = r;
  function o(n) {
    return n < 0.5 ? 2 * n * n : -1 + (4 - 2 * n) * n;
  }
  f.easeInOutQuad = o;
  function u(n) {
    return n * n * n;
  }
  f.easeInCubic = u;
  function a(n) {
    return --n * n * n + 1;
  }
  f.easeOutCubic = a;
  function h(n) {
    return n < 0.5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1;
  }
  f.easeInOutCubic = h;
  function c(n) {
    return n * n * n * n;
  }
  f.easeInQuart = c;
  function l(n) {
    return 1 - --n * n * n * n;
  }
  f.easeOutQuart = l;
  function p(n) {
    return n < 0.5 ? 8 * n * n * n * n : 1 - 8 * --n * n * n * n;
  }
  f.easeInOutQuart = p;
  function g(n) {
    return n * n * n * n * n;
  }
  f.easeInQuint = g;
  function m(n) {
    return 1 + --n * n * n * n * n;
  }
  f.easeOutQuint = m;
  function y(n) {
    return n < 0.5 ? 16 * n * n * n * n * n : 1 + 16 * --n * n * n * n * n;
  }
  f.easeInOutQuint = y;
  function d(n, E, b, A) {
    for (var _ = new Array(M.BEZIER_EASING_CACHE_SIZE), z = 0; z < M.BEZIER_EASING_CACHE_SIZE; ++z)
      _[z] = M.calcBezier({ p0: n.x, p1: E.x, p2: b.x, p3: A.x }, z / (M.BEZIER_EASING_CACHE_SIZE - 1));
    return (I) => I <= n.x ? n.y : A.x <= I ? A.y : M.calcBezier({ p0: n.y, p1: E.y, p2: b.y, p3: A.y }, M.getBezierTfromX({ p0: n.x, p1: E.x, p2: b.x, p3: A.x }, I, _));
  }
  f.bezier = d;
  function x(n, E, b, A) {
    return d(
      { x: 0, y: 0 },
      { x: n, y: E },
      { x: b, y: A },
      { x: 1, y: 1 }
    );
  }
  f.cubicBezier = x;
})(D || (D = {}));
class q extends N {
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
      if (t < i.coordinate.x) {
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
class tt extends N {
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
class et extends N {
  constructor(t, e, s, i) {
    super(), this.coordinate = { x: 0, y: 0 }, this.handleLeft = { x: 0, y: 0 }, this.handleRight = { x: 0, y: 0 }, this.interpolation = "BEZIER", this.easing = null, this.nextFrame = null, this.set(t, e, s, i);
  }
  set(t, e, s, i) {
    this.coordinate = t, this.handleLeft = e || t, this.handleRight = s || t, this.interpolation = i || "BEZIER";
  }
  getEasing(t, e) {
    return t == "BEZIER" ? D.bezier(this.coordinate, this.handleRight, e.handleLeft, e.coordinate) : t == "CONSTANT" ? () => this.coordinate.y : (s) => {
      const i = e.coordinate.y - this.coordinate.y;
      return s = (s - this.coordinate.x) / (e.coordinate.x - this.coordinate.x), this.coordinate.y + s * i;
    };
  }
  to(t, e) {
    return (this.nextFrame == null || this.nextFrame.coordinate.x != t.coordinate.x || this.nextFrame.coordinate.y != t.coordinate.y) && (this.easing = this.getEasing(this.interpolation, t), this.nextFrame = t), this.easing ? this.easing(e) : 0;
  }
}
class ct extends N {
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
  loadJsonScene(t) {
    const e = new XMLHttpRequest();
    e.onreadystatechange = () => {
      e.readyState == 4 && e.status == 200 && this.loadScene(JSON.parse(e.response));
    }, e.open("GET", t), e.send();
  }
  loadScene(t) {
    this.frame.start = t.frame.start, this.frame.end = t.frame.end, this.frame.fps = t.frame.fps, this.curveGroups.length = 0, this.objects.length = 0;
    const e = Object.keys(t.animations);
    for (let i = 0; i < e.length; i++) {
      const r = e[i], o = new tt(r);
      t.animations[r].forEach((u) => {
        const a = new q();
        a.set(u.k.map((h) => {
          const c = {
            B: "BEZIER",
            C: "CONSTANT",
            L: "LINEAR"
          }[h.i];
          return new et(h.c, h.h_l, h.h_r, c);
        })), o.setFCurve(a, u.axis);
      }), this.curveGroups.push(o);
    }
    this.objects.length = 0;
    const s = (i) => {
      const r = { name: "", uniforms: {} };
      i.mat && (r.name = i.mat.n || "", r.uniforms = i.mat.uni || {});
      const o = {
        name: i.n,
        parent: i.prnt,
        children: [],
        animation: i.anim || {},
        position: i.ps || new F(),
        rotation: i.rt || new F(),
        scale: i.sc || new F(),
        material: r,
        type: i.t,
        visible: i.v,
        param: i.prm
      };
      return i.chld && i.chld.forEach((u) => {
        o.children.push(s(u));
      }), this.objects.push(o), o;
    };
    this.scene = s(t.scene), this.emit("sync/scene", [this]);
  }
  onSyncTimeline(t) {
    this.frame = t, this.emit("sync/timeline", [this.frame]);
  }
  onOpen(t) {
    this.connected = !0;
  }
  onMessage(t) {
    const e = JSON.parse(t.data);
    e.type == "sync/scene" ? this.loadScene(e.data) : e.type == "sync/timeline" && this.onSyncTimeline(e.data);
  }
  onClose(t) {
    this.disposeWS();
  }
  getCurveGroup(t) {
    return this.curveGroups.find((e) => e.name == t);
  }
  setFrame(t) {
    this.onSyncTimeline({
      ...this.frame,
      playing: !0,
      current: t
    });
  }
  dispose() {
    this.disposeWS();
  }
  disposeWS() {
    this.ws && (this.ws.close(), this.ws.onmessage = null, this.ws.onclose = null, this.ws.onopen = null, this.connected = !1);
  }
}
var S;
((f) => {
  function t(...e) {
    const s = {};
    for (let i = 0; i < e.length; i++)
      e[i] != null && Object.assign(s, e[i]);
    return s;
  }
  f.merge = t;
})(S || (S = {}));
export {
  ct as BLidge,
  M as Bezier,
  rt as CubeGeometry,
  nt as CylinderGeometry,
  O as ECS,
  D as Easings,
  N as EventEmitter,
  q as FCurve,
  tt as FCurveGroup,
  et as FCurveKeyFrame,
  J as GLPowerBuffer,
  $ as GLPowerFrameBuffer,
  K as GLPowerProgram,
  j as GLPowerTexture,
  it as GLPowerTransformFeedback,
  Y as GLPowerVAO,
  C as Geometry,
  k as Matrix,
  lt as MipMapGeometry,
  ht as PlaneGeometry,
  st as Power,
  X as Quaternion,
  ot as SphereGeometry,
  ut as System,
  at as TorusGeometry,
  S as UniformsUtils,
  F as Vector
};
//# sourceMappingURL=glpower.js.map
