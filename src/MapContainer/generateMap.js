import * as d3 from "d3";
import * as topojson from "topojson";
import world from "./utils/world.json";

export const generateMap = ({
  containerRef,
  canvasRef,
  satellites,
  tooltipRef,
  handleTooltip,
}) => {
  console.log(satellites);

  /* Set up */
  /* ====== */
  const canvasContainer = containerRef.current;
  const canvas = canvasRef.current;
  const tooltip = tooltipRef.current;
  const width = canvasContainer.offsetWidth;
  const height = canvasContainer.offsetHeight;
  const context = canvas.getContext("2d");
  const selection = d3.select(canvas);
  canvas.width = width;
  canvas.height = height;

  const originalScale = height / 3;
  const translation = [width / 2, height / 2];
  const worldVel = [0.1, -0.05, 0];
  const satVel = worldVel[0] * 1.8;
  const satHeight = 1.1;
  let scale = originalScale;

  const sphere = { type: "Sphere" };

  const graticule = d3.geoGraticule();

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
    const grid = graticule();

    const outerArray = [];
    starlink.forEach((satellite) => {
      const innerArray = [+satellite.longitude, +satellite.latitude];
      outerArray.push(innerArray);
    });

    const points = {
      type: "MultiPoint",
      coordinates: outerArray,
    };

    const spin = () => {
      //Update sat locations
      // for (let i = 0; i < points.coordinates.length; i++) {
      //   points.coordinates[i][1] += satVel;
      // }
      //Auto rotate system
      // worldProjection.rotate();
    }; // spin()

    // Draw the world
    const drawWorld = () => {
      requestAnimationFrame(drawWorld);
      context.clearRect(0, 0, width, height);
      context.save();

      context.beginPath();
      worldPath(sphere);
      context.lineWidth = 1;
      context.strokeStyle = "#ccc";
      context.stroke();

      context.beginPath();
      worldPath(grid);
      context.lineWidth = 0.5;
      context.strokeStyle = "#ddd";
      context.stroke();

      context.beginPath();
      worldPath(land);
      context.fillStyle = "#ccc";
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.beginPath();
      satPath(points);
      context.fillStyle = "salmon";
      context.fill();

      context.restore();

      spin();
    }; // drawWorld()

    // First draw
    requestAnimationFrame(drawWorld);

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 4])
      .on("zoom", (e) => {
        scale = originalScale * e.transform.k;
        worldProjection.scale(originalScale * e.transform.k);
        satProjection.scale(originalScale * satHeight * e.transform.k);
        context.restore();
      });

    let rotate0;
    let coords0;
    const coords = (e) => worldProjection.rotate(rotate0).invert([e.x, e.y]);

    const drag = d3
      .drag()
      .on("start", (e) => {
        rotate0 = worldProjection.rotate();
        coords0 = coords(e);
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
      const [longitude, latitude] = satProjection.invert([e.layerX, e.layerY]);
      const satellite = starlink.find((sat) => {
        return (
          Math.abs(sat.longitude - longitude) < 1 &&
          Math.abs(sat.latitude - latitude) < 1
        );
      });
      if (satellite) {
        const tooltipHeight = tooltip.offsetHeight;
        handleTooltip(satellite);
        tooltip.style.top = `${e.y - 16 - tooltipHeight}px`;
        tooltip.style.left = `${e.x}px`;
      } else {
        tooltip.style.top = "-999px";
      }
    };

    selection.on("mousemove", hover);

    selection.call(drag).call(zoom);
  }; // load()

  load(null, satellites, world);
};