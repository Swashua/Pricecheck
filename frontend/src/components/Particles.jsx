import { useEffect, useRef } from 'react';

const CONSTELLATIONS = [
  "Andromeda", "Antlia", "Apus", "Aquarius", "Aquila", "Ara", "Aries", "Auriga",
  "Boötes", "Caelum", "Camelopardalis", "Cancer", "Canes Venatici", "Canis Major",
  "Canis Minor", "Capricornus", "Carina", "Cassiopeia", "Centaurus", "Cepheus",
  "Cetus", "Chamaeleon", "Circinus", "Columba", "Coma Berenices", "Corona Australis",
  "Corona Borealis", "Corvus", "Crater", "Crux", "Cygnus", "Delphinus", "Dorado",
  "Draco", "Equuleus", "Eridanus", "Fornax", "Gemini", "Grus", "Hercules", "Horologium",
  "Hydra", "Hydrus", "Indus", "Lacerta", "Leo", "Leo Minor", "Lepus", "Libra", "Lupus",
  "Lynx", "Lyra", "Mensa", "Microscopium", "Monoceros", "Musca", "Norma", "Octans",
  "Ophiuchus", "Orion", "Pavo", "Pegasus", "Perseus", "Phoenix", "Pictor", "Pisces",
  "Piscis Austrinus", "Puppis", "Pyxis", "Reticulum", "Sagitta", "Sagittarius",
  "Scorpius", "Sculptor", "Scutum", "Serpens", "Sextans", "Taurus", "Telescopium",
  "Triangulum", "Triangulum Australe", "Tucana", "Ursa Major", "Ursa Minor", "Vela",
  "Virgo", "Volans", "Vulpecula"
];

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let stars = [];
    let edges = [];
    let shapes = []; // Store the constellation groups
    
    // Config
    const config = {
      baseColor: 'rgba(255, 250, 205, 0.7)', // Lemon Chiffon
      lineColor: 'rgba(255, 250, 205, 0.25)',
      hoverColor: 'rgba(255, 250, 205, 1)',
      driftSpeed: 0.15,
      constellationCount: 88,
      bgStarCount: 150,
    };

    let globalOffset = { x: 0, y: 0 };
    let mouse = { x: -1000, y: -1000 };
    let hoveredConstellation = null;

    // Procedurally generate a realistic-looking constellation shape
    const generateConstellationShape = (numStars, scale) => {
      const nodes = [];
      const links = [];
      
      for (let i = 0; i < numStars; i++) {
        nodes.push({
          id: i,
          x: Math.random() * scale - scale / 2,
          y: Math.random() * scale - scale / 2
        });
      }

      for (let i = 0; i < numStars - 1; i++) {
        let minDist = Infinity;
        let closest = -1;
        for (let j = i + 1; j < numStars; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            closest = j;
          }
        }
        if (closest !== -1) {
          links.push([i, closest]);
        }
      }
      
      if (numStars > 3) {
        const extraLines = Math.floor(Math.random() * 2) + 1;
        for(let i=0; i < extraLines; i++) {
          const a = Math.floor(Math.random() * numStars);
          const b = Math.floor(Math.random() * numStars);
          if (a !== b) links.push([a, b]);
        }
      }

      return { nodes, links };
    };

    const initConstellations = () => {
      stars = [];
      edges = [];
      shapes = [];
      const width = canvas.width;
      const height = canvas.height;
      let starIndex = 0;

      const virtualWidth = width * 3;
      const virtualHeight = height * 3;

      for (let c = 0; c < config.constellationCount; c++) {
        const numStars = Math.floor(Math.random() * 6) + 4;
        const scale = Math.random() * 150 + 100;
        const shape = generateConstellationShape(numStars, scale);
        
        const cx = Math.random() * virtualWidth - width;
        const cy = Math.random() * virtualHeight - height;
        const rot = Math.random() * Math.PI * 2;

        const startIndex = starIndex;
        const constellationStars = [];

        shape.nodes.forEach(node => {
          const rx = node.x * Math.cos(rot) - node.y * Math.sin(rot);
          const ry = node.x * Math.sin(rot) + node.y * Math.cos(rot);
          
          const starObj = {
            id: starIndex++,
            baseX: cx + rx,
            baseY: cy + ry,
            radius: Math.random() * 1.5 + 1.2,
            isConstellation: true,
            constellationId: c,
          };
          stars.push(starObj);
          constellationStars.push(starObj);
        });

        shape.links.forEach(link => {
          edges.push({ a: startIndex + link[0], b: startIndex + link[1] });
        });

        shapes.push({
          id: c,
          name: CONSTELLATIONS[c % CONSTELLATIONS.length],
          stars: constellationStars
        });
      }

      for (let i = 0; i < config.bgStarCount; i++) {
        stars.push({
          id: starIndex++,
          baseX: Math.random() * virtualWidth - width,
          baseY: Math.random() * virtualHeight - height,
          radius: Math.random() * 1.2 + 0.3,
          isConstellation: false,
          constellationId: null
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initConstellations();
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = (e) => {
      // Don't intercept clicks on interactive elements
      const target = e.target.tagName.toLowerCase();
      if (['button', 'input', 'a'].includes(target)) return;

      if (hoveredConstellation) {
        // Redirect to Wikipedia for that constellation
        const query = encodeURIComponent(hoveredConstellation.name + ' constellation');
        window.open(`https://en.wikipedia.org/wiki/${query}`, '_blank');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      globalOffset.x -= config.driftSpeed;
      globalOffset.y -= config.driftSpeed * 0.4;

      const virtualWidth = canvas.width * 3;
      const virtualHeight = canvas.height * 3;

      if (globalOffset.x < -virtualWidth + canvas.width) globalOffset.x += virtualWidth;
      if (globalOffset.y < -virtualHeight + canvas.height) globalOffset.y += virtualHeight;

      let closestDist = Infinity;
      let closestConstellationId = null;
      let closestCenter = { x: 0, y: 0 };

      // Calculate render positions
      stars.forEach(star => {
        let x = star.baseX + globalOffset.x;
        let y = star.baseY + globalOffset.y;

        if (x < -200) x += virtualWidth;
        else if (x > virtualWidth - 200) x -= virtualWidth;
        
        if (y < -200) y += virtualHeight;
        else if (y > virtualHeight - 200) y -= virtualHeight;

        star.renderX = x;
        star.renderY = y;

        // Check distance to mouse for hover logic
        if (star.isConstellation) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120 && dist < closestDist) {
            closestDist = dist;
            closestConstellationId = star.constellationId;
            closestCenter = { x, y }; // Use the closest star as the anchor for the label
          }
        }
      });

      hoveredConstellation = closestConstellationId !== null ? shapes[closestConstellationId] : null;

      // Cursor pointer if hovering
      if (hoveredConstellation) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }

      // Draw edges
      ctx.lineWidth = 1.2;
      edges.forEach(edge => {
        const a = stars[edge.a];
        const b = stars[edge.b];
        
        const dx = a.renderX - b.renderX;
        const dy = a.renderY - b.renderY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 400) {
          const onScreen = (
            (a.renderX > -50 && a.renderX < canvas.width + 50 && a.renderY > -50 && a.renderY < canvas.height + 50) ||
            (b.renderX > -50 && b.renderX < canvas.width + 50 && b.renderY > -50 && b.renderY < canvas.height + 50)
          );

          if (onScreen) {
            ctx.beginPath();
            ctx.strokeStyle = config.lineColor;

            // Highlight if this edge belongs to the hovered constellation
            if (hoveredConstellation && (a.constellationId === hoveredConstellation.id)) {
              ctx.strokeStyle = config.hoverColor;
              ctx.shadowBlur = 8;
              ctx.shadowColor = config.hoverColor;
            }

            ctx.moveTo(a.renderX, a.renderY);
            ctx.lineTo(b.renderX, b.renderY);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw stars
      stars.forEach(star => {
        if (star.renderX > -50 && star.renderX < canvas.width + 50 && 
            star.renderY > -50 && star.renderY < canvas.height + 50) {
          
          ctx.beginPath();
          ctx.arc(star.renderX, star.renderY, star.radius, 0, Math.PI * 2);
          
          if (hoveredConstellation && star.constellationId === hoveredConstellation.id) {
             ctx.shadowBlur = 15;
             ctx.shadowColor = config.hoverColor;
             ctx.fillStyle = '#FFFFFF';
          } else {
             ctx.shadowBlur = 0;
             ctx.fillStyle = config.baseColor;
          }

          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw hover label
      if (hoveredConstellation) {
        ctx.font = '600 14px Inter, sans-serif';
        const text = hoveredConstellation.name;
        const textWidth = ctx.measureText(text).width;
        
        const labelX = closestCenter.x + 15;
        const labelY = closestCenter.y - 15;

        // Draw background pill
        ctx.fillStyle = 'rgba(0, 45, 38, 0.85)';
        ctx.beginPath();
        ctx.roundRect(labelX - 8, labelY - 18, textWidth + 16, 26, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 250, 205, 0.4)';
        ctx.stroke();

        // Draw text
        ctx.fillStyle = config.hoverColor;
        ctx.fillText(text, labelX, labelY);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
