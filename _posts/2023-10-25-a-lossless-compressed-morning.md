---
layout: post
title: A lossless compressed morning
date: 2023-10-25 07:02:36 +0200
author: Danny Willems
tags: [compression, lossless, lz77, huffman coding, huffman trees]
---

While working on the zkVM project for Optimism with O(1) Labs, I noticed that zlib was used to decompress the memory, encoded in base64.
I opened a PR to decode the state.json that Cannon load-elf command produces,
and I was a bit lost in the different library in Rust implementing `zlib`
(called zeta-lib!). There
are [flate2](https://crates.io/crates/flate2) and [libflate](https://github.com/sile/libflate).
Oh, wait. What is zlib? What are these libraries?
Ok. Let's learn about compression. I've never been into the theory of it,
neither implement any compression algorithm.

Therefore, I woke up the next working, and while I was waiting for my first coffee, I started YouTube-ing: `zlib compression`.
Ok, found [Elegant Compression in Text (The LZ 77 Method) - Computerphile](https://www.youtube.com/watch?v=goOa3DGezUA).
Nice introduction, better than the sum of all naturals are -1/12... Anyway.
Coffee is now ready.
Let's get my breakfast.
Let's watch another one while eating.
[How Computers Compress Text: Huffman Coding and Huffman
Trees](https://www.youtube.com/watch?v=JsTptu56GM8) is the next one.

So, Huffman Coding and Huffman trees. Fascinating! Very smart about the encoding
of the letters. Never saw that before.
As said in the video, instead of working with single letter, let's work with words.

Lempel-Ziv 77 algorithm is a good reading, starting with the [Wikipedia article](https://en.wikipedia.org/wiki/LZ77_and_LZ78)

It drives me to the DEFLATE algorithm. Ah, nice! I know where `flate` comes from now. Ok.
Flate is sometimes used to call the DEFLATE algorithm.

It seems to be the basics of compression.

Ok, but what about zlib now?
zlib is an implementation of the DEFLATE algorithm, and it is used in a lot of different softwares.
The [wikipedia article](https://en.wikipedia.org/wiki/Zlib) mentions a bunch of them.

What about zip, gzip, etc?
- gzip (GNU zip) is a file format, and also the related software implementing it. Good
reading is [the wikipedia article](https://en.wikipedia.org/wiki/Gzip). The filename extension is `gz`
- zip is another file format. Good reading is the [wikipedia article](https://en.wikipedia.org/wiki/ZIP_(file_format).


Therefore, for a structured, in-order, first crash course on compression:

- [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding)
- [LZ-77 & LZ-78](https://en.wikipedia.org/wiki/LZ77_and_LZ78)
- [DEFLATE algorithm](https://en.wikipedia.org/wiki/Deflate) and the [corresponding RFC 1951](https://datatracker.ietf.org/doc/html/rfc1951).
- [zlib](https://en.wikipedia.org/wiki/Zlib), the most used implementation of DEFLATE
- File formats: [gzip](https://en.wikipedia.org/wiki/Gzip), [zip](https://en.wikipedia.org/wiki/ZIP_(file_format)).
