/**
 * Store-only ZIP writer (no compression: MP3/JPEG are already compressed). node:zlib provides
 * CRC-32, so the album archive needs no dependency (ADR-013). Limited to < 4 GB (no ZIP64).
 */
import { crc32 } from 'node:zlib';

export interface ZipEntry {
	name: string;
	data: Uint8Array;
}

function dosTime(d: Date) {
	const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
	const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
	return { time, date };
}

export function zip(entries: ZipEntry[], at = new Date()): Uint8Array<ArrayBuffer> {
	const { time, date } = dosTime(at);
	const enc = new TextEncoder();
	const locals: Buffer[] = [];
	const centrals: Buffer[] = [];
	let offset = 0;

	for (const e of entries) {
		const name = enc.encode(e.name);
		const crc = crc32(e.data);
		const size = e.data.byteLength;

		const local = Buffer.alloc(30);
		local.writeUInt32LE(0x04034b50, 0);
		local.writeUInt16LE(20, 4);
		local.writeUInt16LE(0x0800, 6); // UTF-8 names
		local.writeUInt16LE(0, 8); // stored
		local.writeUInt16LE(time, 10);
		local.writeUInt16LE(date, 12);
		local.writeUInt32LE(crc, 14);
		local.writeUInt32LE(size, 18);
		local.writeUInt32LE(size, 22);
		local.writeUInt16LE(name.length, 26);
		local.writeUInt16LE(0, 28);
		locals.push(local, Buffer.from(name), Buffer.from(e.data.buffer, e.data.byteOffset, size));

		const central = Buffer.alloc(46);
		central.writeUInt32LE(0x02014b50, 0);
		central.writeUInt16LE(20, 4);
		central.writeUInt16LE(20, 6);
		central.writeUInt16LE(0x0800, 8);
		central.writeUInt16LE(0, 10);
		central.writeUInt16LE(time, 12);
		central.writeUInt16LE(date, 14);
		central.writeUInt32LE(crc, 16);
		central.writeUInt32LE(size, 20);
		central.writeUInt32LE(size, 24);
		central.writeUInt16LE(name.length, 28);
		central.writeUInt32LE(offset, 42);
		centrals.push(central, Buffer.from(name));

		offset += 30 + name.length + size;
	}

	const cdSize = centrals.reduce((a, b) => a + b.length, 0);
	if (offset + cdSize > 0xffffffff) throw new Error('Archive trop volumineuse');
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(entries.length, 8);
	end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(cdSize, 12);
	end.writeUInt32LE(offset, 16);

	const out = Buffer.concat([...locals, ...centrals, end]);
	return new Uint8Array(out.buffer, out.byteOffset, out.byteLength) as Uint8Array<ArrayBuffer>;
}
