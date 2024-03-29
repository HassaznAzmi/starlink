import * as d3 from "d3";
import * as topojson from "topojson";
import world from "./utils/world.json";
import topology from "./utils/topology.json";

export const generateMap = ({
  containerRef,
  canvasRef,
  satellites,
  tooltipRef,
  handleTooltip,
}) => {
  /* Set up */
  /* ====== */
  const canvasContainer = containerRef.current;
  const canvas = canvasRef.current;
  const tooltip = tooltipRef.current;
  const context = canvas.getContext("2d");
  const selection = d3.select(canvas);
  let width = canvasContainer.offsetWidth;
  let height = canvasContainer.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const originalScale = Math.min(width, height) / 3;
  const translation = [width / 2, height / 2];
  const satHeight = 1.1;
  let scale = originalScale;

  const starsAmount = 500;
  const stars = [];
  for (var i = 0; i < starsAmount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 3;
    stars.push({ x, y, radius });
  }

  const drawStars = () => {
    if (stars.length > 0) {
      stars.forEach((star) => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "white";
        context.fill();
      });
    }
  };

  const sphere = { type: "Sphere" };

  // set up the main canvas and the projection
  const worldProjection = d3
    .geoOrthographic()
    .scale(scale)
    .translate(translation);
  const satProjection = d3
    .geoOrthographic()
    .scale(scale * satHeight)
    .translate(translation);

  const worldPath = d3.geoPath().projection(worldProjection).context(context);
  const satPath = d3
    .geoPath()
    .projection(satProjection)
    .context(context)
    .pointRadius(2.5);

  /* Data load */
  /* ========= */
  const load = (error, starlink, world) => {
    if (error) {
      console.log(error);
    }

    const land = topojson.feature(world, world.objects.countries);
    const ocean = topojson.feature(topology, topology.objects.ocean);

    const outerArray = [];
    starlink.forEach((satellite) => {
      const innerArray = [+satellite.longitude, +satellite.latitude];
      outerArray.push(innerArray);
    });

    const points = {
      type: "MultiPoint",
      coordinates: outerArray,
    };

    // Draw the world
    const drawWorld = () => {
      requestAnimationFrame(drawWorld);
      context.clearRect(0, 0, width, height);
      drawStars();
      context.save();

      context.beginPath();
      worldPath(sphere);
      context.lineWidth = 1;
      context.strokeStyle = "#ccc";
      context.stroke();

      context.beginPath();
      worldPath(land);
      context.fillStyle = "#ccc";
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.beginPath();
      worldPath(ocean);
      context.fillStyle = "black";
      context.fill();

      context.beginPath();
      satPath(points);
      context.fillStyle = "#3399FF";
      context.fill();

      context.restore();
    };

    // First draw
    requestAnimationFrame(drawWorld);

    const zoom = d3
      .zoom()
      .touchable(true)
      .scaleExtent([1.3, 8])
      .on("zoom", (e) => {
        worldProjection.scale(originalScale * e.transform.k);
        satProjection.scale(originalScale * satHeight * e.transform.k);
      });

    let rotate0;
    let coords0;
    const coords = (e) => worldProjection.rotate(rotate0).invert([e.x, e.y]);

    const drag = d3
      .drag()
      .on("start", (e) => {
        rotate0 = worldProjection.rotate();
        coords0 = coords(e);
        tooltip.style.top = "-999px";
      })
      .on("drag", (e) => {
        const coords1 = coords(e);
        const rotation = [
          rotate0[0] + coords1[0] - coords0[0],
          rotate0[1] + coords1[1] - coords0[1],
        ];
        worldProjection.rotate(rotation);
        satProjection.rotate(rotation);
        context.restore();
      });

    const hover = (e) => {
      const [longitude, latitude] = satProjection.invert([
        e.offsetX,
        e.offsetY,
      ]);
      const satellite = starlink.find((sat) => {
        return (
          Math.abs(sat.longitude - longitude) < 1 &&
          Math.abs(sat.latitude - latitude) < 1
        );
      });
      if (satellite && e.offsetY > 40) {
        const tooltipHeight = tooltip.offsetHeight;
        handleTooltip(satellite);
        tooltip.style.top = `${e.y - 16 - tooltipHeight}px`;
        tooltip.style.left = `${e.x}px`;
      } else {
        tooltip.style.top = "-999px";
      }
    };

    const rescale = () => {
      const w = canvasContainer.offsetWidth;
      const h = canvasContainer.offsetHeight;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;

      worldProjection.scale(Math.min(w, h) / 3).translate([w / 2, h / 2]);
      satProjection
        .scale((Math.min(w, h) / 3) * satHeight)
        .translate([w / 2, h / 2]);

      context.restore();
    };

    window.addEventListener("resize", rescale);

    let initTouches;
    selection.on("mousemove", hover);
    selection
      .on("touchstart", (e) => {
        initTouches = e.touches;
      })
      .on("touchmove", (e) => {
        if (e.touches.length > 1) {
          const initDist = Math.hypot(
            initTouches[0].pageX - initTouches[1].pageX,
            initTouches[0].pageY - initTouches[1].pageY
          );
          const currDist = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          );
          const pinchFactor = currDist / initDist;
          scale = scale * pinchFactor;
          worldProjection.scale(originalScale * pinchFactor);
          satProjection.scale(originalScale * satHeight * pinchFactor);
        }
      });
    selection.call(drag).call(zoom);
  }; // load()

  load(null, satellites, world);

  return {
    stop: () => {
      let id = window.requestAnimationFrame(function () {});
      while (id--) {
        window.cancelAnimationFrame(id);
      }
    },
  };
};
