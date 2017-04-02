namespace Vidyano.WebComponents {
    "use strict";

    @Vidyano.WebComponents.WebComponent.register({
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
    export class OnePageWrapper extends Vidyano.WebComponents.WebComponent {
        private _activeAnchor: HTMLAnchorElement;
        private _routesObserver: PolymerDomChangeObserver;
        isLoading: boolean; private _setIsLoading: (isLoading: boolean) => void;
        size: Vidyano.WebComponents.ISize;
        routes: Vidyano.WebComponents.AppRoute[];
        swiper: Swiper;

        attached() {
            super.attached();

            if (!this._routesObserver)
                this._routesObserver = Polymer.dom(this.$.routes).observeNodes(this._routesChanged.bind(this));
        }

        detached() {
            super.detached();

            Polymer.dom(this.$.routes).unobserveNodes(this._routesObserver);
            this._routesObserver = null;
        }

        private _routesChanged(info: PolymerDomChangedInfo) {
            info.addedNodes.forEach(n => {
                const intercepts: { touchstart?: EventListenerOrEventListenerObject; mousedown?: EventListenerOrEventListenerObject; mousewheel?: EventListenerOrEventListenerObject; } = {};
                n.addEventListener("mousewheel", intercepts.mousewheel = this._intercept.bind(this));
                n.addEventListener("mousedown", intercepts.mousedown = this._intercept.bind(this));
                n.addEventListener("touchstart", intercepts.touchstart = this._intercept.bind(this));
                n["__viScrollerIntercepts"] = intercepts;
            });

            info.removedNodes.forEach(n => {
                const intercepts: { touchstart?: EventListenerOrEventListenerObject; mousedown?: EventListenerOrEventListenerObject; mousewheel?: EventListenerOrEventListenerObject; } = {};
                n["__viScrollerIntercepts"] = intercepts;

                if (!intercepts)
                    return;

                n.removeEventListener("mousewheel", intercepts.mousewheel);
                n.removeEventListener("mousedown", intercepts.mousedown);
                n.removeEventListener("touchstart", intercepts.touchstart);
            });
        }

        private _intercept(e: Event) {
            const scrollerOrMe = this.findParent((e: HTMLElement) => e instanceof Vidyano.WebComponents.Scroller || e === this, <HTMLElement>e.target);
            if (scrollerOrMe instanceof Vidyano.WebComponents.Scroller && scrollerOrMe.innerHeight > scrollerOrMe.outerHeight)
                e.stopPropagation();
        }

        private _updateSwiper(size: Vidyano.WebComponents.ISize, routes: Vidyano.WebComponents.AppRoute[]) {
            this.$["swiperContainer"].style.width = `${size.width}px`;
            this.$["swiperContainer"].style.height = `${size.height}px`;

            if (this.swiper) {
                this.swiper.onResize();
                return;
            }

            if (!routes) {
                this.routes = <Vidyano.WebComponents.AppRoute[]>Polymer.dom(this.$["routes"]).children.filter(c => c instanceof Vidyano.WebComponents.AppRoute);
                if (!this.routes.length) {
                    const interval = setInterval(() => {
                        const routes = <Vidyano.WebComponents.AppRoute[]>Polymer.dom(this.$["routes"]).children.filter(c => c instanceof Vidyano.WebComponents.AppRoute);
                        if (routes.length) {
                            clearInterval(interval);
                            this.routes = routes;
                        }
                    }, 250);
                    return;
                }
            }

            this.routes.forEach(r => r.classList.add("swiper-slide"));

            const mappedPathRoute = Vidyano.Path.match(Vidyano.Path.routes.rootPath + this.app.path, true);
            if (!mappedPathRoute) // 404
                return;

            setTimeout(() => {
                if (this.swiper)
                    return;

                const currentRoute = this.app["routeMap"][Vidyano.WebComponents.App.removeRootPath(mappedPathRoute.path)];

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
            }, 250);
        }

        private _slideChanged(swiper: Swiper) {
            this.app.changePath(this.routes[swiper.activeIndex].route);
            this._updateActiveAnchor(swiper);
        }

        private async _updateActiveAnchor(swiper: Swiper) {
            await this.app.initialize;
            Polymer.dom(this).flush();

            if (this._activeAnchor)
                this._activeAnchor.classList.remove("active");

            this._activeAnchor = <HTMLAnchorElement>this.$["nav"].querySelector(`a:nth-of-type(${swiper.activeIndex + 1})`);
            if (this._activeAnchor)
                this._activeAnchor.classList.add("active");
        }

        private _appRouteActivate(e: Event, details: { route: Vidyano.WebComponents.AppRoute; }) {
            if (this.swiper)
                this.swiper.slideTo(Enumerable.from(this.$.routes.children).indexOf(details.route));
        }
    }
}