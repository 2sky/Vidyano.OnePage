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
        isLoading: boolean; private _setIsLoading: (isLoading: boolean) => void;
        size: Vidyano.WebComponents.ISize;
        routes: Vidyano.WebComponents.AppRoute[];
        swiper: Swiper;

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
        }

        private _slideChanged(swiper: Swiper) {
            this.app.changePath(this.routes[swiper.activeIndex].route);
            this._updateActiveAnchor(swiper);
        }

        private _updateActiveAnchor(swiper: Swiper) {
            if (this._activeAnchor)
                this._activeAnchor.classList.remove("active");

            this._activeAnchor = <HTMLAnchorElement>this.$["nav"].querySelector(`a:nth-of-type(${swiper.activeIndex + 1})`);
            this._activeAnchor.classList.add("active");
        }

        private _changeSlide(e: TapEvent) {
            e.stopPropagation();

            const anchor = <HTMLAnchorElement>e.target;
            this.swiper.slideTo(Enumerable.from(anchor.parentElement.children).indexOf(anchor));
        }
    }
}