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
                var currentRoute = this.app["routeMap"][Vidyano.WebComponents.App.removeRootPath(mappedPathRoute.path)];
                this.swiper = new Swiper(this.$["swiperContainer"], {
                    direction: "vertical",
                    slidesPerView: 1,
                    paginationClickable: true,
                    mousewheelControl: true,
                    setWrapperSize: true,
                    roundLengths: true,
                    initialSlide: this.routes.indexOf(currentRoute),
                    onSlideChangeStart: this._slideChanged.bind(this),
                    slideClass: "swiper-slide",
                    slideActiveClass: "swiper-active"
                });
                this._setIsLoading(false);
                this._updateActiveAnchor(this.swiper);
            };
            OnePageWrapper.prototype._slideChanged = function (swiper) {
                this.app.changePath(this.routes[swiper.activeIndex].route);
                this._updateActiveAnchor(swiper);
            };
            OnePageWrapper.prototype._updateActiveAnchor = function (swiper) {
                if (this._activeAnchor)
                    this._activeAnchor.classList.remove("active");
                this._activeAnchor = this.$["nav"].querySelector("a:nth-of-type(" + (swiper.activeIndex + 1) + ")");
                this._activeAnchor.classList.add("active");
            };
            OnePageWrapper.prototype._changeSlide = function (e) {
                e.stopPropagation();
                var anchor = e.target;
                this.swiper.slideTo(Enumerable.from(anchor.parentElement.children).indexOf(anchor));
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
