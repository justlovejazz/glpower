class P {
  constructor(t, e) {
    this.gl = t, this.program = e, this.vao = this.gl.createVertexArray(), this.attributes = {}, this.indexBuffer = null, this.vertCount = 0, this.indexCount = 0;
  }
  setAttribute(t, e, s, i) {
    let r = this.attributes[t];
    const h = e.array ? e.array.length / s : 0;
    return r ? (r.buffer = e, r.size = s, r.count = h, r.instanceDivisor, r.location = void 0) : (r = {
      buffer: e,
      size: s,
      count: h,
      instanceDivisor: i
    }, this.attributes[t] = r), this.updateAttributes(), this;
  }
  removeAttribute(t) {
    return delete this.attributes[t], this;
  }
  updateAttributes(t) {
    if (!this.vao)
      return;
    this.vertCount = 0;
    const e = Object.keys(this.attributes);
    this.gl.bindVertexArray(this.vao);
    for (let s = 0; s < e.length; s++) {
      const i = e[s], r = this.attributes[i];
      (r.location === void 0 || t) && (r.location = this.gl.getAttribLocation(this.program, i), r.location > -1 && (this.gl.bindBuffer(this.gl.ARRAY_BUFFER, r.buffer.buffer), this.gl.enableVertexAttribArray(r.location), this.gl.vertexAttribPointer(r.location, r.size, this.gl.FLOAT, !1, 0, 0), r.instanceDivisor !== void 0 && this.gl.vertexAttribDivisor(r.location, r.instanceDivisor))), this.vertCount = Math.max(this.vertCount, r.count);
    }
    this.gl.bindVertexArray(null);
  }
  setIndex(t) {
    this.indexBuffer = t, this.vao && (this.gl.bindVertexArray(this.vao), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer ? this.indexBuffer.buffer : null), this.gl.bindVertexArray(null), this.indexBuffer && this.indexBuffer.array && (this.indexCount = this.indexBuffer.array.length));
  }
  getVAO() {
    return this.vao;
  }
}
class D {
  constructor(t) {
    this.gl = t, this.program = this.gl.createProgram(), this.vao = /* @__PURE__ */ new Map(), this.uniforms = /* @__PURE__ */ new Map();
  }
  setShader(t, e) {
    if (this.program === null) {
      console.warn("program is null.");
      return;
    }
    const s = this.createShader(t, this.gl.VERTEX_SHADER), i = this.createShader(e, this.gl.FRAGMENT_SHADER);
    if (!(!s || !i))
      return this.gl.attachShader(this.program, s), this.gl.attachShader(this.program, i), this.gl.linkProgram(this.program), this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS) || console.error("program link error:", this.gl.getProgramInfoLog(this.program)), this;
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
  use() {
    !this.program || this.gl.useProgram(this.program);
  }
  clean() {
    this.gl.useProgram(null);
  }
  getProgram() {
    return this.program;
  }
}
class G {
  constructor(t) {
    this.gl = t, this.buffer = this.gl.createBuffer(), this.array = null;
  }
  setData(t, e = "vbo", s) {
    const i = e == "vbo" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    return this.gl.bindBuffer(i, this.buffer), this.gl.bufferData(i, t, s || this.gl.STATIC_DRAW), this.gl.bindBuffer(i, null), this.array = t, this;
  }
}
class w {
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
    const e = this.x, s = this.y, i = this.z, r = t.x, h = t.y, f = t.z;
    return this.x = s * f - i * h, this.y = i * r - e * f, this.z = e * h - s * r, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  applyMatrix3(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], h = e[4], f = e[5], u = e[6], n = e[8], o = e[9], l = e[10], c = this.x * s + this.y * h + this.z * n, m = this.x * i + this.y * f + this.z * o, g = this.x * r + this.y * u + this.z * l;
    this.x = c, this.y = m, this.z = g, this.w = 0;
  }
  applyMatrix4(t) {
    const e = t.elm, s = e[0], i = e[1], r = e[2], h = e[3], f = e[4], u = e[5], n = e[6], o = e[7], l = e[8], c = e[9], m = e[10], g = e[11], d = e[12], y = e[13], x = e[14], a = e[15], A = this.x * s + this.y * f + this.z * l + this.w * d, v = this.x * i + this.y * u + this.z * c + this.w * y, E = this.x * r + this.y * n + this.z * m + this.w * x, T = this.x * h + this.y * o + this.z * g + this.w * a;
    return this.x = A, this.y = v, this.z = E, this.w = T, this;
  }
  copy(t) {
    var e, s, i, r;
    return this.x = (e = t.x) != null ? e : 0, this.y = (s = t.y) != null ? s : 0, this.z = (i = t.z) != null ? i : 0, this.w = (r = t.w) != null ? r : 0, this;
  }
  clone() {
    return new w(this.x, this.y, this.z, this.w);
  }
  getElm(t) {
    return t == "vec2" ? [this.x, this.y] : t == "vec3" ? [this.x, this.y, this.z] : [this.x, this.y, this.z, this.w];
  }
}
class X {
  constructor(t) {
    this.gl = t, this.image = null, this.unit = 0, this.size = new w(), this.texture = this.gl.createTexture(), this._setting = {
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
class k {
  constructor(t) {
    this.gl = t, this.size = new w(1, 1), this.frameBuffer = this.gl.createFramebuffer(), this.depthRenderBuffer = this.gl.createRenderbuffer(), this.textures = [], this.textureAttachmentList = [], this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer), this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthRenderBuffer), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
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
    return new D(this.gl);
  }
  createBuffer() {
    return new G(this.gl);
  }
  createTexture() {
    return new X(this.gl);
  }
  createFrameBuffer() {
    return new k(this.gl);
  }
}
class C {
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
    return new C().copy(this);
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
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], h = this.elm[5], f = this.elm[6], u = this.elm[7], n = this.elm[8], o = this.elm[9], l = this.elm[10], c = this.elm[11], m = this.elm[12], g = this.elm[13], d = this.elm[14], y = this.elm[15], x = t * h - e * r, a = t * f - s * r, A = t * u - i * r, v = e * f - s * h, E = e * u - i * h, T = s * u - i * f, R = n * g - o * m, _ = n * d - l * m, z = n * y - c * m, F = o * d - l * g, L = o * y - c * g, O = l * y - c * d, U = x * O - a * L + A * F + v * z - E * _ + T * R, b = 1 / U;
    return U == 0 ? this.identity() : (this.elm[0] = (h * O - f * L + u * F) * b, this.elm[1] = (-e * O + s * L - i * F) * b, this.elm[2] = (g * T - d * E + y * v) * b, this.elm[3] = (-o * T + l * E - c * v) * b, this.elm[4] = (-r * O + f * z - u * _) * b, this.elm[5] = (t * O - s * z + i * _) * b, this.elm[6] = (-m * T + d * A - y * a) * b, this.elm[7] = (n * T - l * A + c * a) * b, this.elm[8] = (r * L - h * z + u * R) * b, this.elm[9] = (-t * L + e * z - i * R) * b, this.elm[10] = (m * E - g * A + y * x) * b, this.elm[11] = (-n * E + o * A - c * x) * b, this.elm[12] = (-r * F + h * _ - f * R) * b, this.elm[13] = (t * F - e * _ + s * R) * b, this.elm[14] = (-m * v + g * a - d * x) * b, this.elm[15] = (n * v - o * a + l * x) * b, this);
  }
  transpose() {
    const t = this.elm[0], e = this.elm[1], s = this.elm[2], i = this.elm[3], r = this.elm[4], h = this.elm[5], f = this.elm[6], u = this.elm[7], n = this.elm[8], o = this.elm[9], l = this.elm[10], c = this.elm[11], m = this.elm[12], g = this.elm[13], d = this.elm[14], y = this.elm[15];
    return this.elm[0] = t, this.elm[1] = r, this.elm[2] = n, this.elm[3] = m, this.elm[4] = e, this.elm[5] = h, this.elm[6] = o, this.elm[7] = g, this.elm[8] = s, this.elm[9] = f, this.elm[10] = l, this.elm[11] = d, this.elm[12] = i, this.elm[13] = u, this.elm[14] = c, this.elm[15] = y, this;
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
    const e = t.x, s = t.y, i = t.z, r = t.w, h = e * e, f = s * s, u = i * i, n = r * r, o = e * s, l = e * i, c = e * r, m = s * i, g = s * r, d = i * r;
    return this.matmul([
      h - f - u + n,
      2 * (o + d),
      2 * (l - g),
      0,
      2 * (o - d),
      -h + f - u + n,
      2 * (m + c),
      0,
      2 * (l + g),
      2 * (m - c),
      -h - f + u + n,
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
    const s = Math.sin(t.x / 2), i = Math.sin(t.y / 2), r = Math.sin(t.z / 2), h = Math.cos(t.x / 2), f = Math.cos(t.y / 2), u = Math.cos(t.z / 2);
    return e == "XYZ" ? (this.x = h * i * r + s * f * u, this.y = -s * f * r + h * i * u, this.z = h * f * r + s * i * u, this.w = -s * i * r + h * f * u) : e == "XZY" ? (this.x = -h * i * r + s * f * u, this.y = h * i * u - s * f * r, this.z = s * i * u + h * f * r, this.w = s * i * r + h * f * u) : e == "YZX" ? (this.x = s * f * u + h * i * r, this.y = s * f * r + h * i * u, this.z = -s * i * u + h * f * r, this.w = -s * i * r + h * f * u) : e == "ZYX" && (this.x = s * f * u - h * i * r, this.y = s * f * r + h * i * u, this.z = -s * i * u + h * f * r, this.w = s * i * r + h * f * u), this;
  }
  multiply() {
  }
}
class M {
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
class Y extends M {
  constructor(t = 1, e = 1, s = 1) {
    super();
    const i = t / 2, r = e / 2, h = s / 2, f = [
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
    ], u = [
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
    ], n = [], o = [];
    for (let l = 0; l < 6; l++) {
      n.push(
        0,
        1,
        1,
        1,
        0,
        0,
        1,
        0
      );
      const c = 4 * l;
      o.push(
        0 + c,
        2 + c,
        1 + c,
        1 + c,
        2 + c,
        3 + c
      );
    }
    this.setAttribute("position", f, 3), this.setAttribute("normal", u, 3), this.setAttribute("uv", n, 2), this.setAttribute("index", o, 1);
  }
}
class K extends M {
  constructor(t = 0.5, e = 0.5, s = 1, i = 10, r = 1) {
    super();
    const h = [], f = [], u = [], n = [];
    for (let o = 0; o <= r + 2; o++)
      for (let l = 0; l < i; l++) {
        const c = Math.PI * 2 / i * l;
        if (o <= r) {
          const m = o / r, g = (1 - m) * e + m * t, d = Math.cos(c) * g, y = -(s / 2) + s / r * o, x = Math.sin(c) * g;
          h.push(d, y, x), u.push(
            l / i,
            o / r
          );
          const a = new w(Math.cos(c), 0, Math.sin(c)).normalize();
          f.push(
            a.x,
            a.y,
            a.z
          ), o < r && n.push(
            o * i + l,
            (o + 1) * i + (l + 1) % i,
            o * i + (l + 1) % i,
            o * i + l,
            (o + 1) * i + l,
            (o + 1) * i + (l + 1) % i
          );
        } else {
          const m = o - r - 1, g = m ? t : e, d = Math.cos(c) * g, y = -(s / 2) + s * m, x = Math.sin(c) * g;
          h.push(d, y, x), u.push(
            (d + g) * 0.5 / g,
            (x + g) * 0.5 / g
          ), f.push(0, -1 + m * 2, 0);
          const a = i * (r + (m + 1));
          l <= i - 2 && (m == 0 ? n.push(
            a,
            a + l,
            a + l + 1
          ) : n.push(
            a,
            a + l + 1,
            a + l
          ));
        }
      }
    this.setAttribute("position", h, 3), this.setAttribute("normal", f, 3), this.setAttribute("uv", u, 2), this.setAttribute("index", n, 1);
  }
}
class q extends M {
  constructor(t = 1, e = 1, s = 1, i = 1) {
    super();
    const r = t / 2, h = e / 2, f = [], u = [], n = [], o = [];
    for (let l = 0; l <= i; l++)
      for (let c = 0; c <= s; c++) {
        const m = c / s, g = l / s;
        if (f.push(
          -r + t * m,
          -h + e * g,
          0
        ), n.push(m, g), u.push(0, 0, 1), l > 0 && c > 0) {
          const d = s + 1, y = d * l + c, x = d * (l - 1) + c - 1;
          o.push(
            y,
            d * l + c - 1,
            x,
            y,
            x,
            d * (l - 1) + c
          );
        }
      }
    this.setAttribute("position", f, 3), this.setAttribute("normal", u, 3), this.setAttribute("uv", n, 2), this.setAttribute("index", o, 1);
  }
}
class J extends M {
  constructor(t = 0.5, e = 20, s = 10) {
    super();
    const i = [], r = [], h = [], f = [];
    for (let u = 0; u <= s; u++) {
      const n = u / s * Math.PI, o = (u != 0 && u != s, e);
      for (let l = 0; l < o; l++) {
        const c = l / o * Math.PI * 2, m = Math.sin(n) * t, g = Math.cos(c) * m, d = -Math.cos(n) * t, y = -Math.sin(c) * m;
        i.push(g, d, y), h.push(
          l / o,
          u / s
        );
        const x = new w(g, d, y).normalize();
        r.push(x.x, x.y, x.z), f.push(
          u * e + l,
          u * e + (l + 1) % e,
          (u + 1) * e + (l + 1) % e,
          u * e + l,
          (u + 1) * e + (l + 1) % e,
          (u + 1) * e + l
        );
      }
    }
    this.setAttribute("position", i, 3), this.setAttribute("normal", r, 3), this.setAttribute("uv", h, 2), this.setAttribute("index", f, 1);
  }
  setAttribute(t, e, s) {
    t == "index" && e.forEach((i, r) => {
      e[r] = i % this.count;
    }), super.setAttribute(t, e, s);
  }
}
class $ extends M {
  constructor(t = 7) {
    super(), this.count = t;
    const e = [], s = [], i = [], r = new w(0, 0);
    let h = 1;
    for (let f = 0; f < t; f++) {
      e.push(-1 + r.x, 1 + r.y, 0), e.push(-1 + r.x + h, 1 + r.y, 0), e.push(-1 + r.x + h, 1 + r.y - h, 0), e.push(-1 + r.x, 1 + r.y - h, 0), s.push(0, 1), s.push(1, 1), s.push(1, 0), s.push(0, 0);
      const u = (f + 0) * 4;
      i.push(u + 0, u + 2, u + 1, u + 0, u + 3, u + 2), r.x += h, r.y = r.y - h, h *= 0.5;
    }
    this.setAttribute("position", e, 3), this.setAttribute("uv", s, 2), this.setAttribute("index", i, 1);
  }
}
class tt {
  constructor() {
    this.time = 0, this.lastUpdateTime = new Date().getTime();
  }
  createWorld() {
    return {
      entitiesTotalCount: 0,
      entities: [],
      components: /* @__PURE__ */ new Map(),
      systems: /* @__PURE__ */ new Map()
    };
  }
  createEntity(t) {
    const e = t.entitiesTotalCount++;
    return t.entities.push(e), e;
  }
  removeEntity(t, e) {
    const s = t.entities.findIndex((i) => i == e);
    s > -1 && t.entities.slice(s, 1), t.components.forEach((i) => {
      i[e] = void 0;
    });
  }
  addComponent(t, e, s, i) {
    let r = t.components.get(s);
    return r === void 0 && (r = [], t.components.set(s, r)), r.length < e + 1 && (r.length = e + 1), r[e] = i, i;
  }
  removeComponent(t, e, s) {
    const i = t.components.get(s);
    i && i.length > e && (i[e] = void 0);
  }
  getComponent(t, e, s) {
    const i = t.components.get(s);
    return i !== void 0 ? i[e] : null;
  }
  addSystem(t, e, s) {
    t.systems.set(e, s);
  }
  removeSystem(t, e) {
    t.systems.delete(e);
  }
  update(t) {
    const e = new Date().getTime(), s = (e - this.lastUpdateTime) / 1e3;
    this.time += s, this.lastUpdateTime = e, t.systems.forEach((r) => {
      r.update({
        world: t,
        deltaTime: s,
        time: this.time,
        ecs: this
      });
    });
  }
  getEntities(t, e) {
    return t.entities.filter((i) => {
      for (let r = 0; r < e.length; r++) {
        const h = e[r], f = t.components.get(h);
        if (f === void 0 || f[i] === void 0)
          return !1;
      }
      return !0;
    });
  }
}
var V = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, S = { exports: {} };
/*!
 * EventEmitter v5.2.9 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - https://oli.me.uk/
 * @preserve
 */
(function(p) {
  (function(t) {
    function e() {
    }
    var s = e.prototype, i = t.EventEmitter;
    function r(u, n) {
      for (var o = u.length; o--; )
        if (u[o].listener === n)
          return o;
      return -1;
    }
    function h(u) {
      return function() {
        return this[u].apply(this, arguments);
      };
    }
    s.getListeners = function(n) {
      var o = this._getEvents(), l, c;
      if (n instanceof RegExp) {
        l = {};
        for (c in o)
          o.hasOwnProperty(c) && n.test(c) && (l[c] = o[c]);
      } else
        l = o[n] || (o[n] = []);
      return l;
    }, s.flattenListeners = function(n) {
      var o = [], l;
      for (l = 0; l < n.length; l += 1)
        o.push(n[l].listener);
      return o;
    }, s.getListenersAsObject = function(n) {
      var o = this.getListeners(n), l;
      return o instanceof Array && (l = {}, l[n] = o), l || o;
    };
    function f(u) {
      return typeof u == "function" || u instanceof RegExp ? !0 : u && typeof u == "object" ? f(u.listener) : !1;
    }
    s.addListener = function(n, o) {
      if (!f(o))
        throw new TypeError("listener must be a function");
      var l = this.getListenersAsObject(n), c = typeof o == "object", m;
      for (m in l)
        l.hasOwnProperty(m) && r(l[m], o) === -1 && l[m].push(c ? o : {
          listener: o,
          once: !1
        });
      return this;
    }, s.on = h("addListener"), s.addOnceListener = function(n, o) {
      return this.addListener(n, {
        listener: o,
        once: !0
      });
    }, s.once = h("addOnceListener"), s.defineEvent = function(n) {
      return this.getListeners(n), this;
    }, s.defineEvents = function(n) {
      for (var o = 0; o < n.length; o += 1)
        this.defineEvent(n[o]);
      return this;
    }, s.removeListener = function(n, o) {
      var l = this.getListenersAsObject(n), c, m;
      for (m in l)
        l.hasOwnProperty(m) && (c = r(l[m], o), c !== -1 && l[m].splice(c, 1));
      return this;
    }, s.off = h("removeListener"), s.addListeners = function(n, o) {
      return this.manipulateListeners(!1, n, o);
    }, s.removeListeners = function(n, o) {
      return this.manipulateListeners(!0, n, o);
    }, s.manipulateListeners = function(n, o, l) {
      var c, m, g = n ? this.removeListener : this.addListener, d = n ? this.removeListeners : this.addListeners;
      if (typeof o == "object" && !(o instanceof RegExp))
        for (c in o)
          o.hasOwnProperty(c) && (m = o[c]) && (typeof m == "function" ? g.call(this, c, m) : d.call(this, c, m));
      else
        for (c = l.length; c--; )
          g.call(this, o, l[c]);
      return this;
    }, s.removeEvent = function(n) {
      var o = typeof n, l = this._getEvents(), c;
      if (o === "string")
        delete l[n];
      else if (n instanceof RegExp)
        for (c in l)
          l.hasOwnProperty(c) && n.test(c) && delete l[c];
      else
        delete this._events;
      return this;
    }, s.removeAllListeners = h("removeEvent"), s.emitEvent = function(n, o) {
      var l = this.getListenersAsObject(n), c, m, g, d, y;
      for (d in l)
        if (l.hasOwnProperty(d))
          for (c = l[d].slice(0), g = 0; g < c.length; g++)
            m = c[g], m.once === !0 && this.removeListener(n, m.listener), y = m.listener.apply(this, o || []), y === this._getOnceReturnValue() && this.removeListener(n, m.listener);
      return this;
    }, s.trigger = h("emitEvent"), s.emit = function(n) {
      var o = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(n, o);
    }, s.setOnceReturnValue = function(n) {
      return this._onceReturnValue = n, this;
    }, s._getOnceReturnValue = function() {
      return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0;
    }, s._getEvents = function() {
      return this._events || (this._events = {});
    }, e.noConflict = function() {
      return t.EventEmitter = i, e;
    }, p.exports ? p.exports = e : t.EventEmitter = e;
  })(typeof window < "u" ? window : V || {});
})(S);
const B = S.exports;
class et extends B {
  constructor(t, e) {
    if (super(), this.ecs = t, this.queries = [], e) {
      const s = Object.keys(e);
      for (let i = 0; i < s.length; i++) {
        const r = s[i];
        this.queries.push({ name: r, query: e[r] });
      }
    }
  }
  update(t) {
    for (let e = 0; e < this.queries.length; e++) {
      const s = this.queries[e], i = t.ecs.getEntities(t.world, s.query);
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
    this.emitEvent("dispose");
  }
}
class st {
  constructor(t, e) {
    this.ecs = t, this.world = e, this.entities = [], this.cacheTransformUpdateOrder = null, this.cacheRenderOrder = null;
  }
  add(t, e) {
    const s = this.ecs.getComponent(this.world, t, "sceneNode");
    if (s === null) {
      console.log("parent not exists.");
      return;
    }
    const i = this.ecs.getComponent(this.world, e, "sceneNode");
    if (i === null) {
      console.log("children not exists.");
      return;
    }
    i.parent !== void 0 && this.remove(i.parent, e), s.children.push(e), i.parent = t, this.entities = Array.from(/* @__PURE__ */ new Set([t, e, ...this.entities])), this.cacheTransformUpdateOrder = null;
  }
  remove(t, e) {
    const s = this.ecs.getComponent(this.world, t, "sceneNode");
    if (s === null) {
      console.log("parent not exists.");
      return;
    }
    const i = this.ecs.getComponent(this.world, e, "sceneNode");
    if (i === null) {
      console.log("children not exists.");
      return;
    }
    let r = s.children.findIndex((h) => h == e);
    r > -1 && s.children.splice(r, 1), i.parent = void 0, r = this.entities.findIndex((h) => h === e), r > -1 && this.entities.splice(r, 1), this.cacheTransformUpdateOrder = null;
  }
  getTransformUpdateOrder() {
    if (this.cacheTransformUpdateOrder)
      return this.cacheTransformUpdateOrder;
    const t = [], e = (s) => {
      t.push(s);
      const i = this.ecs.getComponent(this.world, s, "sceneNode");
      if (i)
        for (let r = 0; r < i.children.length; r++)
          e(i.children[r]);
    };
    for (let s = 0; s < this.entities.length; s++) {
      const i = this.entities[s], r = this.ecs.getComponent(this.world, i, "sceneNode");
      r && r.parent === void 0 && e(i);
    }
    return this.cacheTransformUpdateOrder = t, t;
  }
}
var I;
((p) => {
  p.NEWTON_ITERATIONS = 4, p.NEWTON_MIN_SLOPE = 1e-3, p.SUBDIVISION_PRECISION = 1e-7, p.SUBDIVISION_MAX_ITERATIONS = 10, p.BEZIER_EASING_CACHE_SIZE = 11, p.BEZIER_EASING_SAMPLE_STEP_SIZE = 1 / p.BEZIER_EASING_CACHE_SIZE;
  function t(n) {
    return -n.p0 + 3 * n.p1 - 3 * n.p2 + n.p3;
  }
  function e(n) {
    return 3 * n.p0 - 6 * n.p1 + 3 * n.p2;
  }
  function s(n) {
    return -3 * n.p0 + 3 * n.p1;
  }
  function i(n, o) {
    return 3 * t(n) * o * o + 2 * e(n) * o + s(n);
  }
  p.calcBezierSlope = i;
  function r(n, o) {
    return ((t(n) * o + e(n)) * o + s(n)) * o + n.p0;
  }
  p.calcBezier = r;
  function h(n, o, l, c) {
    let m = 0, g = 0;
    for (let d = 0; d < p.SUBDIVISION_MAX_ITERATIONS; d++)
      g = o + (l - o) / 2, m = r(c, g), m > n ? l = g : o = g;
    return g;
  }
  function f(n, o, l) {
    for (let c = 0; c < p.NEWTON_ITERATIONS; c++) {
      const m = i(o, l);
      if (m == 0)
        return l;
      l -= (r(o, l) - n) / m;
    }
    return l;
  }
  function u(n, o, l) {
    n.p1 = Math.max(n.p0, Math.min(n.p3, n.p1)), n.p2 = Math.max(n.p0, Math.min(n.p3, n.p2));
    let c = 0;
    for (let d = 1; d < l.length && (c = d - 1, !(o < l[d])); d++)
      ;
    const m = c / (p.BEZIER_EASING_CACHE_SIZE - 1), g = i(n, m) / (n.p3 - n.p0);
    return g == 0 ? m : g > 0.01 ? f(o, n, m) : h(o, m, m + p.BEZIER_EASING_SAMPLE_STEP_SIZE, n);
  }
  p.getBezierTfromX = u;
})(I || (I = {}));
var N;
((p) => {
  function t(a = 6) {
    return (A) => {
      var v = Math.exp(-a * (2 * A - 1)), E = Math.exp(-a);
      return (1 + (1 - v) / (1 + v) * (1 + E) / (1 - E)) / 2;
    };
  }
  p.sigmoid = t;
  function e(a, A, v) {
    const E = Math.max(0, Math.min(1, (v - a) / (A - a)));
    return E * E * (3 - 2 * E);
  }
  p.smoothstep = e;
  function s(a) {
    return a;
  }
  p.linear = s;
  function i(a) {
    return a * a;
  }
  p.easeInQuad = i;
  function r(a) {
    return a * (2 - a);
  }
  p.easeOutQuad = r;
  function h(a) {
    return a < 0.5 ? 2 * a * a : -1 + (4 - 2 * a) * a;
  }
  p.easeInOutQuad = h;
  function f(a) {
    return a * a * a;
  }
  p.easeInCubic = f;
  function u(a) {
    return --a * a * a + 1;
  }
  p.easeOutCubic = u;
  function n(a) {
    return a < 0.5 ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1;
  }
  p.easeInOutCubic = n;
  function o(a) {
    return a * a * a * a;
  }
  p.easeInQuart = o;
  function l(a) {
    return 1 - --a * a * a * a;
  }
  p.easeOutQuart = l;
  function c(a) {
    return a < 0.5 ? 8 * a * a * a * a : 1 - 8 * --a * a * a * a;
  }
  p.easeInOutQuart = c;
  function m(a) {
    return a * a * a * a * a;
  }
  p.easeInQuint = m;
  function g(a) {
    return 1 + --a * a * a * a * a;
  }
  p.easeOutQuint = g;
  function d(a) {
    return a < 0.5 ? 16 * a * a * a * a * a : 1 + 16 * --a * a * a * a * a;
  }
  p.easeInOutQuint = d;
  function y(a, A, v, E) {
    for (var T = new Array(I.BEZIER_EASING_CACHE_SIZE), R = 0; R < I.BEZIER_EASING_CACHE_SIZE; ++R)
      T[R] = I.calcBezier({ p0: a.x, p1: A.x, p2: v.x, p3: E.x }, R / (I.BEZIER_EASING_CACHE_SIZE - 1));
    return (_) => _ <= a.x ? a.y : E.x <= _ ? E.y : I.calcBezier({ p0: a.y, p1: A.y, p2: v.y, p3: E.y }, I.getBezierTfromX({ p0: a.x, p1: A.x, p2: v.x, p3: E.x }, _, T));
  }
  p.bezier = y;
  function x(a, A, v, E) {
    return y(
      { x: 0, y: 0 },
      { x: a, y: A },
      { x: v, y: E },
      { x: 1, y: 1 }
    );
  }
  p.cubicBezier = x;
})(N || (N = {}));
class Z extends B {
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
class j extends B {
  constructor(t, e, s, i, r) {
    super(), this.updatedFrame = -1, this.name = t || "", this.frameStart = 0, this.frameEnd = 0, this.frameDuration = 0, this.curves = /* @__PURE__ */ new Map(), this.value = new w(), e && this.setFCurve(e, "x"), s && this.setFCurve(s, "y"), i && this.setFCurve(i, "z"), r && this.setFCurve(r, "w");
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
class Q extends B {
  constructor(t, e, s, i) {
    super(), this.coordinate = { x: 0, y: 0 }, this.handleLeft = { x: 0, y: 0 }, this.handleRight = { x: 0, y: 0 }, this.interpolation = "BEZIER", this.easing = null, this.nextFrame = null, this.set(t, e, s, i);
  }
  set(t, e, s, i) {
    this.coordinate = t, this.handleLeft = e || t, this.handleRight = s || t, this.interpolation = i || "BEZIER";
  }
  getEasing(t, e) {
    return t == "BEZIER" ? N.bezier(this.coordinate, this.handleRight, e.handleLeft, e.coordinate) : t == "CONSTANT" ? () => this.coordinate.y : (s) => {
      const i = e.coordinate.y - this.coordinate.y;
      return s = (s - this.coordinate.x) / (e.coordinate.x - this.coordinate.x), this.coordinate.y + s * i;
    };
  }
  to(t, e) {
    return (this.nextFrame == null || this.nextFrame.coordinate.x != t.coordinate.x || this.nextFrame.coordinate.y != t.coordinate.y) && (this.easing = this.getEasing(this.interpolation, t), this.nextFrame = t), this.easing ? this.easing(e) : 0;
  }
}
class it extends B {
  constructor(t) {
    super(), this.connected = !1, this.frame = {
      start: -1,
      end: -1,
      current: -1
    }, this.objects = [], this.curveGroups = [], this.scene = null, t && (this.url = t, this.connect(this.url));
  }
  connect(t) {
    this.url = t, this.ws = new WebSocket(this.url), this.ws.onopen = this.onOpen.bind(this), this.ws.onmessage = this.onMessage.bind(this), this.ws.onclose = this.onClose.bind(this), this.ws.onerror = (e) => {
      console.error(e), this.emitEvent("error");
    };
  }
  syncJsonScene(t) {
    const e = new XMLHttpRequest();
    e.onreadystatechange = () => {
      e.readyState == 4 && e.status == 200 && this.onSyncScene(JSON.parse(e.response));
    }, e.open("GET", t), e.send();
  }
  onSyncScene(t) {
    this.frame.start = t.frame.start, this.frame.end = t.frame.end, this.curveGroups.length = 0, this.objects.length = 0;
    const e = Object.keys(t.animations);
    for (let i = 0; i < e.length; i++) {
      const r = e[i], h = new j(r);
      t.animations[r].forEach((f) => {
        const u = new Z();
        u.set(f.keyframes.map((n) => new Q(n.c, n.h_l, n.h_r, n.i))), h.setFCurve(u, f.axis);
      }), this.curveGroups.push(h);
    }
    this.scene = t.scene, this.objects.length = 0;
    const s = (i) => {
      this.objects.push(i), i.children.forEach((r) => s(r));
    };
    s(this.scene), this.emitEvent("sync/scene", [this]);
  }
  onSyncTimeline(t) {
    this.frame = t, this.emitEvent("sync/timeline", [this.frame]);
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
  it as BLidge,
  I as Bezier,
  Y as CubeGeometry,
  K as CylinderGeometry,
  tt as ECS,
  N as Easings,
  Z as FCurve,
  j as FCurveGroup,
  Q as FCurveKeyFrame,
  G as GLPowerBuffer,
  k as GLPowerFrameBuffer,
  D as GLPowerProgram,
  X as GLPowerTexture,
  P as GLPowerVAO,
  M as Geometry,
  C as Matrix,
  $ as MipMapGeometry,
  q as PlaneGeometry,
  H as Power,
  W as Quaternion,
  st as SceneGraph,
  J as SphereGeometry,
  et as System,
  w as Vector
};
//# sourceMappingURL=glpower.js.map
