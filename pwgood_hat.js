(function () {
    const PLUGIN_ID = 'pwgood_hat';

    const TEX_FRONT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABz0lEQVR4AWySvWpCQRCFBytBryJGDKJYBiF2BgstfALJC2gdfAMr30RS+BimM5WCpNLYiSIRo+DPBbtkv5NcEZKQszM7c87Z2fWGHuv1r2tUK5U/e2oAHhGQg5C5P8/z7DaTESrVquJDuWx3hYLdF4sC9es9Gic1GZDE43ErOMFquTT/eLTFYmHkuVxO9f1+bwAeyGSzyH4MIp5nsVjMTqeTPbVaAiaQDoeD6o1GwwCmKDEjagIc2dRqNdtsNgJG1MB/dQ743G4txAKJkYnguduVCacATKnRA9SIIHSTTOpu3B/ifD7XIxIZGZDzyEQ4cBGj1QRcoVQq2fl8tmg0qrvm83kbjUYCOUb04MDlfZhebxCM5Pu+RSIRjc9pnU7HACJOpgeH09FoApbgkSCEw2ELxBBBu922VCpl9OBghoaeJsB1616UAmDURCJBakHU5neBi0ZXYKGO83q9NppJ97DNZvMi7vV6uhY9OHD5ZpheE7DBMZ1O4yUTXhohmE6nqsFjOrgiukU/426309dGAxIg59vgl2APHF//5GjYaALGmkwmNpvNbLVaWZATIQLqYDgcqo/mYvDhRODdmbwOBhbkb+OxvfT7AnVALwAG3wAAAP//Is7AhgAAAAZJREFUAwBe4XO+HVsd1gAAAABJRU5ErkJggg==";
    const TEX_TOP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpklEQVR4AWTSu0qzQRAG4CFtsknhX/wEA1ppRDsPhd6AFuJFayGWitFKIRIstMjBWvcZsiD4wewc33dm59vO1eXl9285Oz3944sRdTRhk07Ur5QSTfYPDuLo5CRlZzyO7a2tECP884uL9NVXaCQBY7i5GYfHxzGuoMViEWT29ha7e3sZG41GMZ/PlQZbPScJuqXEcDiM1WoVPjawol6vJxQ04HQ6TfIM1iMJBoNBghUhmc1mNRXZsdkC8l/LJTNzH5+f0XEY7enxMSaTSeigu9ERy4kjQg4t/75u0vm3sRFYAdxfAVs3VxEzOpAmcuR/vTJsTvD7ropNgagJH8iSERPTmT53oFMrbsk2svGRircauX6/HzmBoyWalnR3nYFpIDsg8ne3t1meE0imtz68AUD315kGQmQPxA7yCg4LQoKd1h1wzZeKj7RbSj44OzB9TmBBSDAD+yuIECZ6fbTJxE0knL9RwoYFgP0VhEZG1AS5GgJD5wSKFXVLCWDstMciB0iQIwXmR/2SYFmf53N9hQA319dhw/yaj5fX13i4v09hq5Gj5X8AAAD//5ypiaUAAAAGSURBVAMAS7BDvsikyA8AAAAASUVORK5CYII=";
    const TEX_SIDE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrUlEQVR4AWSSu27CQBBFr2jNQkGKCEGdgEJHQAgKf4GVH6CP+E5SUdCBQwuygghIPCzRJT4T1rKIpbvz2Jk7j3XpLYp+ihgNh/9sfIA4JEAHJWWfc06P9bphOBqZfO339dRq6aXTyVG0yclSZQQo1WpVrSyhnhGl57PW67WSzUbNZtPA/fF4NB1fvdEg7Y8gcE6VSkWXy8XQ7fUESeCcTqeTyuWy3ZMIMZnEI60DggnEAZIkQchXhRgSnD4Wou/9XiUOLmgXJ0B/brfFOL6qJw2c0+dyqa9bkdJDrabAOdE2O6Bq4BycNg6VIWF+yLlnmSyRXOsAJ20Cqlr27aByvFjYgiFidsAS6d52ADs7AMusPeYkCZtx6A7yG6ctlhzrgGM8HmswGCiKIqG/TyYC2Mhut6swDHPgDzMbQusgjmNdr1d7+91ul0v0exCLL01T2QgcMOFAQuQl+j2CILBijET31gEGSZB4eBt5D2K8z57xcDjYk+EskmH7YOR2uxWSGHK4tw64YPur1Uo822w2E7rHfD43298RS05OwF8F+MM+plP7y9ABdhHEeUDwCwAA//9zCOfgAAAABklEQVQDAAlzfL4yjlqcAAAAAElFTkSuQmCC";

    let format = null;
    let codec = null;
    let setting = null;
    let ghostGroup = null;
    let renderMode = null;
    let renderAction = null;
    let toggleAction = null;
    let cameraAnglePreset = null;
    let eventListeners = [];

    function isPwhFormat() {
        try {
            if (typeof Format !== 'undefined' && Format && Format.id === 'pwgood_hat') return true;
            if (typeof Project !== 'undefined' && Project && typeof Project === 'object' && Project.format && Project.format.id === 'pwgood_hat') return true;
        } catch (e) {}
        return false;
    }

    function createBlockTexture(dataUrl) {
        if (typeof THREE === 'undefined') return null;
        if (typeof document === 'undefined') return null;
        if (typeof Image === 'undefined') return null;

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        const notify = () => {
            texture.needsUpdate = true;
            if (typeof Canvas !== 'undefined' && Canvas.scene) {
                if (typeof Canvas.updateView === 'function') {
                    try { Canvas.updateView(); } catch (e) {}
                }
                if (typeof Canvas.render === 'function') {
                    try { Canvas.render(); } catch (e) {}
                }
            }
            if (typeof main_preview !== 'undefined' && main_preview && typeof main_preview.render === 'function') {
                try { main_preview.render(); } catch (e) {}
            }
        };

        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, 16, 16);
            ctx.drawImage(img, 0, 0, 16, 16);
            notify();
        };
        img.src = dataUrl;
        if (img.complete && img.naturalWidth) {
            ctx.clearRect(0, 0, 16, 16);
            ctx.drawImage(img, 0, 0, 16, 16);
            notify();
        }
        return texture;
    }

    function buildDispenserMesh() {
        if (typeof THREE === 'undefined') return null;

        const group = new THREE.Group();
        group.name = 'pwgood_dispenser_ghost';

        const frontTex = createBlockTexture(TEX_FRONT);
        const topTex = createBlockTexture(TEX_TOP);
        const sideTex = createBlockTexture(TEX_SIDE);

        const makeMat = (tex) => new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.9,
            depthWrite: true,
            side: THREE.DoubleSide
        });

        const materials = [
            makeMat(sideTex),
            makeMat(sideTex),
            makeMat(topTex),
            makeMat(topTex),
            makeMat(sideTex),
            makeMat(frontTex)
        ];

        const geometry = new THREE.BoxGeometry(16, 16, 16);
        geometry.translate(0, 8, 0);

        const mesh = new THREE.Mesh(geometry, materials);
        mesh.name = 'dispenser_ghost_mesh';
        mesh.isGhost = true;
        mesh.renderOrder = 999;
        group.add(mesh);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x55ccff,
            transparent: true,
            opacity: 0.45,
            linewidth: 1
        });
        const line = new THREE.LineSegments(edges, lineMat);
        line.renderOrder = 1000;
        group.add(line);

        return group;
    }

    function updateDispenserGuide() {
        try {
            const active = isPwhFormat();
            let visible = true;
            if (typeof Settings !== 'undefined' && Settings.get) {
                visible = Settings.get('pwh_show_dispenser') !== false;
            } else if (setting && setting.value !== undefined) {
                visible = setting.value !== false;
            }

            const shouldShow = active && visible;

            if (!ghostGroup && typeof THREE !== 'undefined') {
                ghostGroup = buildDispenserMesh();
            }

            if (ghostGroup && typeof Canvas !== 'undefined' && Canvas.scene) {
                ghostGroup.visible = shouldShow;
                const inScene = Canvas.scene.children.includes(ghostGroup);
                if (shouldShow && !inScene) {
                    Canvas.scene.add(ghostGroup);
                } else if (!shouldShow && inScene) {
                    Canvas.scene.remove(ghostGroup);
                }
            }

            if (active && typeof setStartScreen === 'function' && typeof Project !== 'undefined' && Project) {
                setStartScreen(false);
            }
        } catch (err) {
            console.error('[PWGood Hat] updateDispenserGuide error:', err);
        }
    }

    function getHatPlacement(yOffset = 0) {
        let min = [Infinity, Infinity, Infinity];
        let max = [-Infinity, -Infinity, -Infinity];
        let count = 0;

        if (typeof Cube !== 'undefined' && Array.isArray(Cube.all)) {
            for (const cube of Cube.all) {
                if (cube.from && cube.to) {
                    for (let i = 0; i < 3; i++) {
                        min[i] = Math.min(min[i], cube.from[i], cube.to[i]);
                        max[i] = Math.max(max[i], cube.from[i], cube.to[i]);
                    }
                    count++;
                }
            }
        }

        if (count === 0) {
            min = [-8, 16, -8];
            max = [8, 24, 8];
        }

        const center = [
            Number(((min[0] + max[0]) / 2).toFixed(3)),
            Number(((min[1] + max[1]) / 2).toFixed(3)),
            Number(((min[2] + max[2]) / 2).toFixed(3))
        ];
        const size = [
            Number((max[0] - min[0]).toFixed(3)),
            Number((max[1] - min[1]).toFixed(3)),
            Number((max[2] - min[2]).toFixed(3))
        ];

        return {
            target: 'dispenser',
            dispenser: {
                size: [16, 16, 16],
                bounds: { min: [-8, 0, -8], max: [8, 16, 8] },
                center: [0, 8, 0],
                top_center: [0, 16, 0]
            },
            hat: {
                bounds: { min, max },
                size,
                center,
                y_offset: yOffset,
                offset_from_head_top: [
                    center[0],
                    Number((min[1] - 16 + yOffset).toFixed(3)),
                    center[2]
                ],
                offset_from_head_center: [
                    center[0],
                    Number((center[1] - 8 + yOffset).toFixed(3)),
                    center[2]
                ]
            }
        };
    }

    function compilePwh(renderSettings, thumbnail) {
        const projectName = (typeof Project !== 'undefined' && Project.name) ? Project.name : 'PWGood Hat';
        const yOffset = renderSettings && typeof renderSettings.y_offset === 'number' ? renderSettings.y_offset : 0;
        const placement = getHatPlacement(yOffset);

        const elements = [];
        if (typeof Cube !== 'undefined' && Array.isArray(Cube.all)) {
            for (const cube of Cube.all) {
                const faces = {};
                if (cube.faces) {
                    for (const side of ['north', 'east', 'south', 'west', 'up', 'down']) {
                        const f = cube.faces[side];
                        if (f) {
                            faces[side] = {
                                uv: f.uv ? [f.uv[0], f.uv[1], f.uv[2], f.uv[3]] : [0, 0, 0, 0],
                                texture: f.texture || null,
                                rotation: f.rotation || 0
                            };
                        }
                    }
                }
                elements.push({
                    uuid: cube.uuid,
                    name: cube.name,
                    from: cube.from ? [...cube.from] : [0, 0, 0],
                    to: cube.to ? [...cube.to] : [1, 1, 1],
                    origin: cube.origin ? [...cube.origin] : [0, 0, 0],
                    rotation: cube.rotation ? [...cube.rotation] : [0, 0, 0],
                    inflate: cube.inflate || 0,
                    box_uv: !!cube.box_uv,
                    visibility: cube.visibility !== false,
                    faces
                });
            }
        }

        const textures = [];
        if (typeof Texture !== 'undefined' && Array.isArray(Texture.all)) {
            for (const tex of Texture.all) {
                let data = '';
                if (typeof tex.getBase64 === 'function') {
                    data = tex.getBase64();
                } else if (tex.source && typeof tex.source === 'string') {
                    data = tex.source;
                }
                textures.push({
                    uuid: tex.uuid,
                    id: tex.id || tex.uuid,
                    name: tex.name || 'texture.png',
                    width: tex.width || 64,
                    height: tex.height || 64,
                    data
                });
            }
        }

        let outliner = [];
        if (typeof Outliner !== 'undefined' && Array.isArray(Outliner.root)) {
            const serialize = (node) => {
                if (typeof Group !== 'undefined' && node instanceof Group) {
                    return {
                        type: 'group',
                        uuid: node.uuid,
                        name: node.name,
                        origin: node.origin ? [...node.origin] : [0, 0, 0],
                        rotation: node.rotation ? [...node.rotation] : [0, 0, 0],
                        children: Array.isArray(node.children) ? node.children.map(serialize) : []
                    };
                }
                return {
                    type: 'cube',
                    uuid: node.uuid,
                    name: node.name
                };
            };
            outliner = Outliner.root.map(serialize);
        }

        return JSON.stringify({
            format_version: '1.0.0',
            type: 'pwgood_hat',
            meta: {
                name: projectName,
                created_at: new Date().toISOString(),
                generator: 'PWGood Hat Blockbench Plugin'
            },
            placement,
            model: {
                box_uv: typeof Project !== 'undefined' ? !!Project.box_uv : true,
                texture_width: typeof Project !== 'undefined' ? (Project.texture_width || 64) : 64,
                texture_height: typeof Project !== 'undefined' ? (Project.texture_height || 64) : 64,
                elements,
                outliner
            },
            textures,
            render_settings: renderSettings || {
                pitch: 30,
                yaw: 225,
                roll: 0,
                distance: 36,
                y_offset: 0,
                greenscreen: false,
                greenscreen_color: '#00FF00'
            },
            thumbnail: thumbnail || ''
        }, null, 2);
    }

    function parsePwh(raw) {
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!data || data.type !== 'pwgood_hat') {
            throw new Error('Invalid .pwh model file');
        }

        if (typeof Format !== 'undefined' && Format && Format.id !== 'pwgood_hat') {
            if (typeof Formats !== 'undefined' && Formats.pwgood_hat) {
                Formats.pwgood_hat.select();
            }
        }

        if (typeof Project !== 'undefined') {
            Project.name = (data.meta && data.meta.name) ? data.meta.name : 'PWGood Hat';
            if (data.model) {
                Project.box_uv = data.model.box_uv !== false;
                Project.texture_width = data.model.texture_width || 64;
                Project.texture_height = data.model.texture_height || 64;
            }
        }

        const textureMap = {};
        if (Array.isArray(data.textures) && typeof Texture !== 'undefined') {
            for (const t of data.textures) {
                const tex = new Texture({ name: t.name || 'texture.png' });
                if (t.data && typeof tex.fromDataURL === 'function') {
                    tex.fromDataURL(t.data);
                }
                tex.add(false);
                textureMap[t.uuid || t.id] = tex.uuid;
            }
        }

        if (data.model && Array.isArray(data.model.elements) && typeof Cube !== 'undefined') {
            for (const elem of data.model.elements) {
                const cube = new Cube({
                    name: elem.name,
                    from: elem.from,
                    to: elem.to,
                    origin: elem.origin,
                    rotation: elem.rotation,
                    inflate: elem.inflate || 0,
                    box_uv: elem.box_uv !== false
                });

                if (elem.faces && cube.faces) {
                    for (const side of ['north', 'south', 'east', 'west', 'up', 'down']) {
                        if (elem.faces[side] && cube.faces[side]) {
                            cube.faces[side].uv = elem.faces[side].uv;
                            const origTex = elem.faces[side].texture;
                            if (origTex && textureMap[origTex]) {
                                cube.faces[side].texture = textureMap[origTex];
                            }
                        }
                    }
                }
                cube.init();
            }
        }

        if (typeof setStartScreen === 'function') {
            setStartScreen(false);
        }
        updateDispenserGuide();
    }

    function parseColorString(val) {
        if (!val) return '#00FF00';
        if (typeof val === 'string') return val;
        if (typeof val.toHexString === 'function') return val.toHexString();
        if (typeof val.toRgbString === 'function') return val.toRgbString();
        if (typeof val.hex === 'string') return '#' + val.hex;
        if (typeof val.r === 'number' && typeof val.g === 'number' && typeof val.b === 'number') {
            const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
            return '#' + toHex(val.r) + toHex(val.g) + toHex(val.b);
        }
        return String(val);
    }

    function openRenderDialog() {
        if (typeof THREE === 'undefined' || typeof Dialog === 'undefined') return;

        let pitch = 30;
        let yaw = 225;
        let roll = 0;
        let distance = 36;
        let yOffset = 0;
        let useGreenscreen = false;
        let greenscreenColor = '#00FF00';
        let resolution = 512;

        let previewRenderer = null;
        let previewScene = null;
        let previewCamera = null;
        let clonesGroup = null;

        const target = new THREE.Vector3(0, 8, 0);

        const html = `
            <div id="pwh_render_layout" style="display:flex; gap:16px; align-items:flex-start;">
                <div id="pwh_canvas_container" class="checkerboard" style="flex:0 0 320px; width:320px; height:320px; border-radius:4px; overflow:hidden; border:1px solid var(--color-border, #3a3f4b); cursor:grab; position:relative;">
                    <canvas id="pwh_canvas" width="320" height="320" style="display:block; width:100%; height:100%;"></canvas>
                </div>
                <div id="pwh_form_slot" style="flex:1; min-width:0;"></div>
            </div>
        `;

        const dialog = new Dialog({
            id: 'pwh_render_dialog',
            title: 'Render & Export',
            width: 740,
            part_order: ['lines', 'form'],
            lines: [html],
            form: {
                angle_preset: {
                    type: 'select',
                    label: 'Angle Preset',
                    value: 'dispenser_default',
                    options: {
                        dispenser_default: 'Dispenser Default Angle',
                        front: 'Front',
                        side: 'Side',
                        top: 'Top',
                        back: 'Back',
                        custom: 'Custom'
                    }
                },
                pitch: {
                    type: 'range',
                    label: 'Pitch',
                    min: -90,
                    max: 90,
                    value: 30
                },
                yaw: {
                    type: 'range',
                    label: 'Yaw',
                    min: 0,
                    max: 360,
                    value: 225
                },
                roll: {
                    type: 'range',
                    label: 'Roll',
                    min: -180,
                    max: 180,
                    value: 0
                },
                zoom: {
                    type: 'range',
                    label: 'Distance (Zoom)',
                    min: 14,
                    max: 80,
                    value: 36
                },
                y_offset: {
                    type: 'range',
                    label: 'Hat Y Offset',
                    min: -16,
                    max: 32,
                    value: 0,
                    step: 0.5
                },
                greenscreen: {
                    type: 'checkbox',
                    label: 'Green Screen',
                    value: false
                },
                color: {
                    type: 'color',
                    label: 'Background Color',
                    value: '#00FF00'
                },
                resolution: {
                    type: 'select',
                    label: 'Resolution',
                    value: '512',
                    options: {
                        '256': '256 x 256',
                        '512': '512 x 512',
                        '1024': '1024 x 1024',
                        '2048': '2048 x 2048'
                    }
                }
            },
            buttons: [
                'Export PNG',
                'dialog.close'
            ],
            onButton: function (index) {
                if (index === 0) {
                    doExportPNG();
                    return false;
                } else {
                    cleanup();
                }
            },
            onOpen: function () {
                const slot = document.getElementById('pwh_form_slot');
                if (slot && dialog.form && dialog.form.node) {
                    slot.appendChild(dialog.form.node);
                }
            },
            onCancel: function () {
                cleanup();
            },
            onClose: function () {
                cleanup();
            },
            onFormChange: function (formResult) {
                if (formResult.angle_preset !== 'custom') {
                    if (formResult.angle_preset === 'dispenser_default') {
                        pitch = 30; yaw = 225; roll = 0;
                    } else if (formResult.angle_preset === 'front') {
                        pitch = 0; yaw = 180; roll = 0;
                    } else if (formResult.angle_preset === 'side') {
                        pitch = 0; yaw = 270; roll = 0;
                    } else if (formResult.angle_preset === 'top') {
                        pitch = 89; yaw = 180; roll = 0;
                    } else if (formResult.angle_preset === 'back') {
                        pitch = 0; yaw = 0; roll = 0;
                    }
                    dialog.setFormValues({ pitch, yaw, roll }, false);
                } else {
                    pitch = typeof formResult.pitch === 'number' ? formResult.pitch : pitch;
                    yaw = typeof formResult.yaw === 'number' ? formResult.yaw : yaw;
                    roll = typeof formResult.roll === 'number' ? formResult.roll : roll;
                }

                distance = typeof formResult.zoom === 'number' ? formResult.zoom : distance;
                yOffset = typeof formResult.y_offset === 'number' ? formResult.y_offset : 0;
                useGreenscreen = !!formResult.greenscreen;
                greenscreenColor = parseColorString(formResult.color);
                resolution = parseInt(formResult.resolution) || 512;

                render();
            }
        });

        dialog.show();

        const slot = document.getElementById('pwh_form_slot');
        if (slot && dialog.form && dialog.form.node) {
            slot.appendChild(dialog.form.node);
        }

        const container = document.getElementById('pwh_canvas_container');
        const canvas = document.getElementById('pwh_canvas');
        if (!canvas) return;

        previewRenderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        previewRenderer.setSize(320, 320);
        previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        previewScene = new THREE.Scene();

        const ambLight = new THREE.AmbientLight(0xffffff, 0.75);
        previewScene.add(ambLight);

        const dir1 = new THREE.DirectionalLight(0xffffff, 0.65);
        dir1.position.set(20, 40, 30);
        previewScene.add(dir1);

        const dir2 = new THREE.DirectionalLight(0xffffff, 0.35);
        dir2.position.set(-20, -10, -20);
        previewScene.add(dir2);

        previewCamera = new THREE.OrthographicCamera(-18, 18, 18, -18, 0.1, 2000);

        const holdoutGeom = new THREE.BoxGeometry(16, 16, 16);
        holdoutGeom.translate(0, 8, 0);
        const holdoutMat = new THREE.MeshBasicMaterial({
            colorWrite: false,
            depthWrite: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
        const holdoutMesh = new THREE.Mesh(holdoutGeom, holdoutMat);
        holdoutMesh.name = 'pwh_holdout_mask';
        holdoutMesh.renderOrder = -1;
        previewScene.add(holdoutMesh);

        clonesGroup = new THREE.Group();
        clonesGroup.renderOrder = 1;
        previewScene.add(clonesGroup);

        if (typeof Cube !== 'undefined' && Array.isArray(Cube.all)) {
            for (const cube of Cube.all) {
                if (cube.visibility !== false && cube.mesh) {
                    try {
                        const clone = new THREE.Mesh(cube.mesh.geometry, cube.mesh.material);
                        clone.matrixAutoUpdate = false;
                        cube.mesh.updateMatrixWorld(true);
                        clone.matrix.copy(cube.mesh.matrixWorld);
                        clonesGroup.add(clone);
                    } catch (e) {}
                }
            }
        }

        function render() {
            if (!previewRenderer || !previewScene || !previewCamera) return;

            if (clonesGroup) {
                clonesGroup.position.set(0, yOffset, 0);
                clonesGroup.updateMatrixWorld(true);
            }

            const radPitch = (pitch * Math.PI) / 180;
            const radYaw = (yaw * Math.PI) / 180;
            const radRoll = (roll * Math.PI) / 180;

            const camDist = 200;
            const cx = target.x + camDist * Math.cos(radPitch) * Math.sin(radYaw);
            const cy = target.y + camDist * Math.sin(radPitch);
            const cz = target.z + camDist * Math.cos(radPitch) * Math.cos(radYaw);

            previewCamera.position.set(cx, cy, cz);
            previewCamera.up.set(0, 1, 0);
            previewCamera.lookAt(target);

            const half = distance / 2;
            previewCamera.left = -half;
            previewCamera.right = half;
            previewCamera.top = half;
            previewCamera.bottom = -half;
            previewCamera.updateProjectionMatrix();

            if (radRoll !== 0) {
                previewCamera.rotation.z += radRoll;
            }

            if (useGreenscreen) {
                previewScene.background = new THREE.Color(greenscreenColor);
                previewRenderer.setClearColor(greenscreenColor, 1);
                if (container) {
                    container.classList.remove('checkerboard');
                    container.style.backgroundColor = greenscreenColor;
                }
            } else {
                previewScene.background = null;
                previewRenderer.setClearColor(0x000000, 0);
                if (container) {
                    container.classList.add('checkerboard');
                    container.style.backgroundColor = '';
                }
            }

            previewRenderer.render(previewScene, previewCamera);
        }

        render();

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        const onDown = (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            if (container) container.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

            yaw = (yaw + dx * 0.7) % 360;
            if (yaw < 0) yaw += 360;
            pitch = Math.max(-89, Math.min(89, pitch - dy * 0.7));

            dialog.setFormValues({
                angle_preset: 'custom',
                pitch: Math.round(pitch),
                yaw: Math.round(yaw)
            }, false);

            render();
        };

        const onUp = () => {
            isDragging = false;
            if (container) container.style.cursor = 'grab';
        };

        const onWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 2 : -2;
            distance = Math.max(14, Math.min(80, distance + delta));
            dialog.setFormValues({ zoom: Math.round(distance) }, false);
            render();
        };

        if (container) {
            container.addEventListener('mousedown', onDown);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
            container.addEventListener('wheel', onWheel, { passive: false });
        }

        function renderOffscreen(res) {
            const offscreen = document.createElement('canvas');
            offscreen.width = res;
            offscreen.height = res;

            const r = new THREE.WebGLRenderer({
                canvas: offscreen,
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
            });
            r.setSize(res, res);

            if (clonesGroup) {
                clonesGroup.position.set(0, yOffset, 0);
                clonesGroup.updateMatrixWorld(true);
            }

            if (useGreenscreen) {
                previewScene.background = new THREE.Color(greenscreenColor);
                r.setClearColor(greenscreenColor, 1);
            } else {
                previewScene.background = null;
                r.setClearColor(0x000000, 0);
            }

            const cam = previewCamera.clone();
            const half = distance / 2;
            cam.left = -half;
            cam.right = half;
            cam.top = half;
            cam.bottom = -half;
            cam.updateProjectionMatrix();

            r.render(previewScene, cam);
            const data = offscreen.toDataURL('image/png');
            r.dispose();
            return data;
        }

        function doExportPNG() {
            const dataUrl = renderOffscreen(resolution);
            const name = ((typeof Project !== 'undefined' && Project.name) ? Project.name : 'hat') + '_render.png';

            if (typeof Blockbench !== 'undefined' && Blockbench.export) {
                Blockbench.export({
                    resource_id: 'pwh_render_png',
                    type: 'PNG Image',
                    extensions: ['png'],
                    name,
                    content: dataUrl,
                    savetype: 'image'
                }, () => {
                    Blockbench.showQuickMessage('Exported ' + name, 2000);
                });
            } else {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = name;
                a.click();
            }
        }

        function doExportPWH() {
            const thumb = renderOffscreen(128);
            const settings = {
                pitch,
                yaw,
                roll,
                distance,
                y_offset: yOffset,
                greenscreen: useGreenscreen,
                greenscreen_color: greenscreenColor
            };
            const json = compilePwh(settings, thumb);
            const name = ((typeof Project !== 'undefined' && Project.name) ? Project.name : 'hat') + '.pwh';

            if (typeof Blockbench !== 'undefined' && Blockbench.export) {
                Blockbench.export({
                    resource_id: 'pwh_file',
                    type: 'PWGood Hat Model',
                    extensions: ['pwh'],
                    name,
                    content: json,
                    savetype: 'text'
                }, () => {
                    Blockbench.showQuickMessage('Exported ' + name, 2000);
                });
            } else {
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();
                URL.revokeObjectURL(url);
            }
        }

        function cleanup() {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            if (container) {
                container.removeEventListener('mousedown', onDown);
                container.removeEventListener('wheel', onWheel);
            }
            if (previewRenderer) {
                previewRenderer.dispose();
                previewRenderer = null;
            }
        }
    }

    if (typeof BBPlugin !== 'undefined' && BBPlugin.register) {
        BBPlugin.register(PLUGIN_ID, {
            title: 'PWGood Hat',
            author: 'PWGood',
            icon: 'icon-player',
            description: 'PWGood Hat project format with dispenser reference and render dialog',
            version: '1.3.0',
            min_version: '4.8.0',
            variant: 'both',

            onload() {
                codec = new Codec('pwgood_hat_pwh', {
                    name: 'PWGood Hat Model',
                    extension: 'pwh',
                    remember: true,
                    load_filter: {
                        type: 'json',
                        extensions: ['pwh']
                    },
                    compile(options) {
                        return compilePwh();
                    },
                    parse(data, path) {
                        parsePwh(data);
                    },
                    export() {
                        const content = compilePwh();
                        const name = ((typeof Project !== 'undefined' && Project.name) ? Project.name : 'hat') + '.pwh';
                        Blockbench.export({
                            resource_id: 'pwgood_hat_pwh',
                            type: 'PWGood Hat Model',
                            extensions: ['pwh'],
                            name,
                            content,
                            savetype: 'text'
                        });
                    }
                });

                format = new ModelFormat('pwgood_hat', {
                    id: 'pwgood_hat',
                    name: 'PWGood Hat',
                    description: 'Model hats for PWGood with a dispenser reference block and render dialog',
                    icon: 'icon-player',
                    category: 'minecraft',
                    target: ['Minecraft: Java Edition'],
                    show_on_start_screen: true,
                    box_uv: true,
                    optional_box_uv: true,
                    single_texture: true,
                    bone_rig: true,
                    centered_grid: true,
                    rotate_cubes: true,
                    integer_size: false,
                    animation_mode: false,
                    codec: (typeof Codecs !== 'undefined' && Codecs.project) ? Codecs.project : codec,
                    onSetup(project) {
                        updateDispenserGuide();
                    }
                });

                format.new = function () {
                    const res = newProject(this);
                    if (res && typeof setStartScreen === 'function') {
                        setStartScreen(false);
                    }
                    return res;
                };

                renderMode = new Mode('render', {
                    name: 'Render',
                    icon: 'photo_camera',
                    condition: () => isPwhFormat(),
                    onSelect() {
                        openRenderDialog();
                    }
                });

                setting = new Setting('pwh_show_dispenser', {
                    name: 'Show PWGood Dispenser Guide',
                    description: 'Display dispenser block ghost in PWGood Hat projects',
                    category: 'preview',
                    value: true,
                    type: 'toggle',
                    onChange(val) {
                        updateDispenserGuide();
                    }
                });

                renderAction = new Action('pwh_render', {
                    name: 'Render',
                    description: 'Render PWGood Hat (camera angles, greenscreen, PNG / .pwh export)',
                    icon: 'photo_camera',
                    category: 'export',
                    keybind: new Keybind({ key: 'F4' }),
                    condition: () => isPwhFormat(),
                    click: () => openRenderDialog()
                });

                toggleAction = new Action('pwh_toggle_dispenser', {
                    name: 'Toggle Dispenser Guide',
                    icon: 'visibility',
                    category: 'view',
                    condition: () => isPwhFormat(),
                    click: () => {
                        const current = setting.get ? setting.get() : setting.value;
                        const next = !current;
                        if (setting.set) setting.set(next);
                        setting.value = next;
                        updateDispenserGuide();
                    }
                });

                cameraAnglePreset = {
                    name: 'Dispenser Default Angle',
                    id: 'dispenser_default',
                    projection: 'orthographic',
                    position: [-512, 512 * 0.8165 + 8, -512],
                    target: [0, 8, 0],
                    zoom: 0.5,
                    default: true
                };
                if (typeof DefaultCameraPresets !== 'undefined' && Array.isArray(DefaultCameraPresets)) {
                    DefaultCameraPresets.push(cameraAnglePreset);
                }

                if (typeof MenuBar !== 'undefined' && MenuBar.addAction) {
                    MenuBar.addAction(renderAction, 'file.export');
                    MenuBar.addAction(toggleAction, 'view');
                }

                const bindEvent = (evt, fn) => {
                    if (typeof Blockbench !== 'undefined' && Blockbench.on) {
                        Blockbench.on(evt, fn);
                        eventListeners.push({ evt, fn });
                    }
                };

                bindEvent('setup_project', () => updateDispenserGuide());
                bindEvent('select_project', () => updateDispenserGuide());
                bindEvent('unselect_project', () => updateDispenserGuide());
                bindEvent('close_project', () => updateDispenserGuide());

                updateDispenserGuide();
            },

            onunload() {
                if (ghostGroup && typeof Canvas !== 'undefined' && Canvas.scene) {
                    Canvas.scene.remove(ghostGroup);
                    ghostGroup = null;
                }

                if (cameraAnglePreset && typeof DefaultCameraPresets !== 'undefined' && Array.isArray(DefaultCameraPresets)) {
                    const idx = DefaultCameraPresets.indexOf(cameraAnglePreset);
                    if (idx !== -1) DefaultCameraPresets.splice(idx, 1);
                }

                if (renderMode) renderMode.delete();
                if (renderAction) renderAction.delete();
                if (toggleAction) toggleAction.delete();
                if (setting) setting.delete();
                if (format) format.delete();
                if (codec) codec.delete();

                for (const item of eventListeners) {
                    if (typeof Blockbench !== 'undefined' && Blockbench.removeListener) {
                        Blockbench.removeListener(item.evt, item.fn);
                    }
                }
                eventListeners = [];
            }
        });
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            PLUGIN_ID,
            TEX_FRONT,
            TEX_TOP,
            TEX_SIDE,
            isPwhFormat,
            buildDispenserMesh,
            getHatPlacement,
            compilePwh,
            parsePwh,
            updateDispenserGuide,
            openRenderDialog
        };
    }
})();
