var Vidyano;
(function (Vidyano) {
    var WebComponents;
    (function (WebComponents) {
        "use strict";
        var OnePageWrapper = (function (_super) {
            __extends(OnePageWrapper, _super);
            function OnePageWrapper() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            OnePageWrapper.prototype.attached = function () {
                _super.prototype.attached.call(this);
                if (!this._routesObserver)
                    this._routesObserver = Polymer.dom(this.$.routes).observeNodes(this._routesChanged.bind(this));
            };
            OnePageWrapper.prototype.detached = function () {
                _super.prototype.detached.call(this);
                Polymer.dom(this.$.routes).unobserveNodes(this._routesObserver);
                this._routesObserver = null;
            };
            OnePageWrapper.prototype._routesChanged = function (info) {
                var _this = this;
                info.addedNodes.forEach(function (n) {
                    var intercepts = {};
                    n.addEventListener("mousewheel", intercepts.mousewheel = _this._intercept.bind(_this));
                    n.addEventListener("mousedown", intercepts.mousedown = _this._intercept.bind(_this));
                    n.addEventListener("touchstart", intercepts.touchstart = _this._intercept.bind(_this));
                    n["__viScrollerIntercepts"] = intercepts;
                });
                info.removedNodes.forEach(function (n) {
                    var intercepts = {};
                    n["__viScrollerIntercepts"] = intercepts;
                    if (!intercepts)
                        return;
                    n.removeEventListener("mousewheel", intercepts.mousewheel);
                    n.removeEventListener("mousedown", intercepts.mousedown);
                    n.removeEventListener("touchstart", intercepts.touchstart);
                });
            };
            OnePageWrapper.prototype._intercept = function (e) {
                var _this = this;
                var scrollerOrMe = this.findParent(function (e) { return e instanceof Vidyano.WebComponents.Scroller || e === _this; }, e.target);
                if (scrollerOrMe instanceof Vidyano.WebComponents.Scroller && scrollerOrMe.innerHeight > scrollerOrMe.outerHeight)
                    e.stopPropagation();
            };
            OnePageWrapper.prototype._updateSwiper = function (size, routes) {
                var _this = this;
                this.$["swiperContainer"].style.width = size.width + "px";
                this.$["swiperContainer"].style.height = size.height + "px";
                if (this.swiper) {
                    this.swiper.onResize();
                    return;
                }
                if (!routes) {
                    this.routes = Polymer.dom(this.$["routes"]).children.filter(function (c) { return c instanceof Vidyano.WebComponents.AppRoute; });
                    if (!this.routes.length) {
                        var interval_1 = setInterval(function () {
                            var routes = Polymer.dom(_this.$["routes"]).children.filter(function (c) { return c instanceof Vidyano.WebComponents.AppRoute; });
                            if (routes.length) {
                                clearInterval(interval_1);
                                _this.routes = routes;
                            }
                        }, 250);
                        return;
                    }
                }
                this.routes.forEach(function (r) { return r.classList.add("swiper-slide"); });
                var mappedPathRoute = Vidyano.Path.match(Vidyano.Path.routes.rootPath + this.app.path, true);
                if (!mappedPathRoute)
                    return;
                setTimeout(function () {
                    if (_this.swiper)
                        return;
                    var currentRoute = _this.app["routeMap"][Vidyano.WebComponents.App.removeRootPath(mappedPathRoute.path)];
                    _this.swiper = new Swiper(_this.$["swiperContainer"], {
                        direction: "vertical",
                        slidesPerView: 1,
                        paginationClickable: true,
                        mousewheelControl: true,
                        setWrapperSize: true,
                        roundLengths: true,
                        initialSlide: _this.routes.indexOf(currentRoute),
                        onSlideChangeStart: _this._slideChanged.bind(_this),
                        slideClass: "swiper-slide",
                        slideActiveClass: "swiper-active"
                    });
                    _this._setIsLoading(false);
                    _this._updateActiveAnchor(_this.swiper);
                }, 250);
            };
            OnePageWrapper.prototype._slideChanged = function (swiper) {
                this.app.changePath(this.routes[swiper.activeIndex].route);
                this._updateActiveAnchor(swiper);
            };
            OnePageWrapper.prototype._updateActiveAnchor = function (swiper) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.app.initialize];
                            case 1:
                                _a.sent();
                                Polymer.dom(this).flush();
                                if (this._activeAnchor)
                                    this._activeAnchor.classList.remove("active");
                                this._activeAnchor = this.$["nav"].querySelector("a:nth-of-type(" + (swiper.activeIndex + 1) + ")");
                                if (this._activeAnchor)
                                    this._activeAnchor.classList.add("active");
                                return [2 /*return*/];
                        }
                    });
                });
            };
            OnePageWrapper.prototype._appRouteActivate = function (e, details) {
                if (this.swiper)
                    this.swiper.slideTo(Enumerable.from(this.$.routes.children).indexOf(details.route));
            };
            return OnePageWrapper;
        }(Vidyano.WebComponents.WebComponent));
        OnePageWrapper = __decorate([
            Vidyano.WebComponents.WebComponent.register({
                properties: {
                    isLoading: {
                        type: Boolean,
                        reflectToAttribute: true,
                        readOnly: true,
                        value: true
                    },
                    size: Object,
                    routes: {
                        type: Object,
                        value: null
                    }
                },
                observers: [
                    "_updateSwiper(size, routes)"
                ]
            }, "vi")
        ], OnePageWrapper);
        WebComponents.OnePageWrapper = OnePageWrapper;
    })(WebComponents = Vidyano.WebComponents || (Vidyano.WebComponents = {}));
})(Vidyano || (Vidyano = {}));
