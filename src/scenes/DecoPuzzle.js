import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

const SlidingPuzzle = {
	ALLOW_CLICK: 0,
	TWEENING: 1
};

export class DecoPuzzle extends Phaser.Scene {
	constructor () {
		super({ key: 'DecoPuzzle' });
		this.currentRound = 1;
		this.rows = 0;
		this.columns = 0;
		this.pieceWidth = 0;
		this.pieceHeight = 0;
		this.pieces = null;
		this.spacer = null;
		this.slideSpeed = 300;
		this.slideEase = 'power3';
		this.iterations = 9;
		this.shuffleSpeed = 200;
		this.shuffleEase = 'power1';
		this.lastMove = null;
		this.photo = '';
		this.slices = [];
		this.action = SlidingPuzzle.ALLOW_CLICK;
		this.startTime = 0;
	}

	preload () {
		// Carica le immagini usate nel puzzle (si usa lo stesso asset per tutte)
		this.load.image('sfondo', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('logodeco', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('box-deco', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('box-inside-deco', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('stemma', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('logoDeco', 'assets/decopuzzle/logo-de-co.png');
		this.load.image('comuneAcqua', 'assets/decopuzzle/comune-acquaviva.png');
		
		// Carica le immagini per i round successivi
		this.load.image('foto1', 'assets/decopuzzle/stemma-comune.png');
		this.load.image('foto2', 'assets/decopuzzle/logo-de-co.png'); // Sostituisci con il percorso corretto
		this.load.image('foto3', 'assets/decopuzzle/comune-acquaviva.png'); // Sostituisci con il percorso corretto
	}

	create () {
		// Callback per risolvere il puzzle tramite window.solve()
		window.solve = () => this.nextRound();
		this.events.on('shutdown', () => {
			delete window.solve;
		});

		this.titleText = this.add.text(
			this.cameras.main.centerX,
			80,
			'Stemma di Acquaviva Picena',
			{
				fontFamily: 'Poppins',
				fontSize: '24px',
				color: '#000000',
				align: 'center',
				wordWrap: { width: this.cameras.main.width * 0.8 }
			}
		).setOrigin(0.5);

		this.fullImage = this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY - 50,
			 'foto1'
		).setOrigin(0.5);

		this.startButton = createPrimaryButton(
			this,
			this.cameras.main.centerX,
			this.cameras.main.centerY + this.fullImage.displayHeight / 2 + 50,
			'Inizia',
			() => {
				this.fullImage.destroy();
				// Avvia il puzzle con 'stemma'
				this.startPuzzle('foto1', 3, 3);
				this.startButton.destroy();
				this.startTime = this.time.now;
			}
		);
	}

	startPuzzle (key, rows, columns) {
		this.photo = key;
		this.rows = rows;
		this.columns = columns;
		const texture = this.textures.getFrame(key);
		const photoWidth = texture.width;
		const photoHeight = texture.height;
		const pieceWidth = photoWidth / rows;
		const pieceHeight = photoHeight / columns;
		this.pieceWidth = pieceWidth;
		this.pieceHeight = pieceHeight;

		// Crea o resetta il container dei pezzi
		if (this.pieces) {
			this.pieces.removeAll(true);
		} else {
			this.pieces = this.add.container(
				this.cameras.main.centerX - (pieceWidth * rows) / 2,
				this.cameras.main.centerY - (pieceHeight * columns) / 2
			);
		}

		// Ripulisce le texture dei pezzi precedenti
		this.slices.forEach(slice => slice.destroy());
		this.slices = [];

		let i = 0;
		for (let y = 0; y < this.columns; y++) {
			for (let x = 0; x < this.rows; x++) {
				 // Genera una chiave univoca per ogni texture dinamica
				const sliceKey = `slice_${this.photo}_${i}_${Date.now()}`;
				
				// Rimuovi le vecchie texture se esistono
				if (this.textures.exists(sliceKey)) {
					this.textures.remove(sliceKey);
				}

				const slice = this.textures.addDynamicTexture(sliceKey, pieceWidth, pieceHeight);
				const ox = x / this.rows;
				const oy = y / this.columns;
				
				slice.stamp(key, null, 0, 0, { originX: ox, originY: oy });
				this.slices.push(slice);

				const piece = this.add.image(x * pieceWidth, y * pieceHeight, sliceKey)
					.setOrigin(0, 0)
					.setData({
						row: x,
						column: y,
						correctRow: x,
						correctColumn: y,
						textureKey: sliceKey // Salva la chiave della texture per riferimento futuro
					});

				piece.setInteractive();
				piece.on('pointerdown', () => this.checkPiece(piece));
				this.pieces.add(piece);
				i++;
			}
		}

		// Usa l'ultimo pezzo come spacer (invisibile)
		this.spacer = this.pieces.getAt(this.pieces.length - 1);
		this.spacer.alpha = 0;
		this.lastMove = null;
		this.shufflePieces();
	}

	shufflePieces () {
		const moves = [];
		const spacerCol = this.spacer.data.get('column');
		const spacerRow = this.spacer.data.get('row');

		if (spacerCol > 0 && this.lastMove !== Phaser.DOWN) moves.push(Phaser.UP);
		if (spacerCol < this.columns - 1 && this.lastMove !== Phaser.UP) moves.push(Phaser.DOWN);
		if (spacerRow > 0 && this.lastMove !== Phaser.RIGHT) moves.push(Phaser.LEFT);
		if (spacerRow < this.rows - 1 && this.lastMove !== Phaser.LEFT) moves.push(Phaser.RIGHT);

		this.lastMove = Phaser.Utils.Array.GetRandom(moves);

		switch (this.lastMove) {
			case Phaser.UP:
				this.swapPiece(spacerRow, spacerCol - 1);
				break;
			case Phaser.DOWN:
				this.swapPiece(spacerRow, spacerCol + 1);
				break;
			case Phaser.LEFT:
				this.swapPiece(spacerRow - 1, spacerCol);
				break;
			case Phaser.RIGHT:
				this.swapPiece(spacerRow + 1, spacerCol);
				break;
		}
	}

	swapPiece (row, column) {
		const piece = this.getPiece(row, column);
		const spacer = this.spacer;
		const x = spacer.x;
		const y = spacer.y;

		// Scambia i dati di posizione
		piece.data.values.row = spacer.data.values.row;
		piece.data.values.column = spacer.data.values.column;
		spacer.data.values.row = row;
		spacer.data.values.column = column;
		spacer.setPosition(piece.x, piece.y);

		if (this.shuffleSpeed === 0) {
			piece.setPosition(x, y);
			if (this.iterations > 0) {
				this.iterations--;
				this.shufflePieces();
			} else {
				this.startPlay();
			}
		} else {
			const tween = this.tweens.add({
				targets: piece,
				x: x,
				y: y,
				duration: this.shuffleSpeed,
				ease: this.shuffleEase
			});
			if (this.iterations > 0) {
				this.iterations--;
				tween.on('complete', this.shufflePieces, this);
			} else {
				tween.on('complete', this.startPlay, this);
			}
		}
	}

	getPiece (row, column) {
		for (let i = 0; i < this.pieces.length; i++) {
			const piece = this.pieces.getAt(i);
			if (piece.data.get('row') === row && piece.data.get('column') === column) {
				return piece;
			}
		}
		return null;
	}

	startPlay () {
		this.action = SlidingPuzzle.ALLOW_CLICK;
	}

	checkPiece(piece) {
		if (this.action !== SlidingPuzzle.ALLOW_CLICK) return;
		const spacer = this.spacer;
		// Permetti lo scambio se il pezzo cliccato non è lo spacer
		if (piece !== spacer) {
			const targetRow = spacer.data.values.row;
			const targetColumn = spacer.data.values.column;
			// Scambia i dati di posizione
			spacer.data.values.row = piece.data.values.row;
			spacer.data.values.column = piece.data.values.column;
			piece.data.values.row = targetRow;
			piece.data.values.column = targetColumn;
			this.slidePiece(piece, spacer.x, spacer.y);
			spacer.setPosition(piece.x, piece.y);
		}
	}

	slidePiece (piece, x, y) {
		this.action = SlidingPuzzle.TWEENING;
		this.tweens.add({
			targets: piece,
			x,
			y,
			duration: this.slideSpeed,
			ease: this.slideEase,
			onComplete: () => this.tweenOver()
		});
	}

	tweenOver () {
		let outOfSequence = false;
		this.iterations = 6; // Resetta il numero di iterazioni
		this.lastMove = null; // Resetta l'ultima mossa
		this.pieces.each(piece => {
			if (
				piece.data.values.correctRow !== piece.data.values.row ||
				piece.data.values.correctColumn !== piece.data.values.column
			) {
				outOfSequence = true;
			}
		});
		if (outOfSequence) {
			this.action = SlidingPuzzle.ALLOW_CLICK;
		} else {
			// Rimuovo la chiamata audio e avvio il prossimo round
			this.tweens.add({
				targets: this.spacer,
				alpha: 1,
				duration: this.slideSpeed * 2,
				ease: 'linear',
				onComplete: () => this.nextRound()
			});
			this.pieces.each(piece => {
				piece.setPostPipeline('ShinePostFX');
			});
		}
	}

	nextRound () {
		this.currentRound++;
		if (this.currentRound >= 4) {
			this.calculateScore();
			return;
		}

		let size, iterations, nextPhoto, title;
		if (this.currentRound === 2) {
			nextPhoto = 'foto2';
			size = 3;
			iterations = 6;
			title = 'Logo De.C.O. Denominazione Comunale di Origine';
		} else if (this.currentRound === 3) {
			nextPhoto = 'foto3';
			size = 3;
			iterations = 6;
			title = 'Comune di Acquaviva Picena';
		}

		if (this.titleText) {
			this.titleText.setText(title);
		} else {
			this.titleText = this.add.text(
				this.cameras.main.centerX,
				80,
				title,
				{
					fontFamily: 'Poppins',
					fontSize: '24px',
					color: '#000000',
					align: 'center',
					wordWrap: { width: this.cameras.main.width * 0.8 }
				}
			).setOrigin(0.5);
		}

		let fullImage = this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			nextPhoto
		).setOrigin(0.5);

		let countdownText = this.add.text(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			'3',
			{ fontSize: '64px', fill: '#fff' }
		).setOrigin(0.5);

		let countdown = 3;
		this.time.addEvent({
			delay: 1000,
			repeat: 2,
			callback: () => {
				countdown--;
				if (countdown > 0) {
					countdownText.setText(countdown.toString());
				} else {
					countdownText.destroy();
					fullImage.destroy();
					this.photo = nextPhoto;
					this.iterations = iterations;
					this.startPuzzle(nextPhoto, size, size);
				}
			},
			callbackScope: this
		});
	}

	calculateScore () {
		const timeElapsed = this.time.now - this.startTime;
		const baseScore = 10000;
		const finalScore = Math.max(0, Math.ceil(baseScore - timeElapsed / 1000));
		this.scene.start('FineDecoPuzzle', { score: finalScore, time: timeElapsed });
	}
}