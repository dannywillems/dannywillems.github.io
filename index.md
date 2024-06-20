<div class="row">
  <div class="col-6">
    <div class="center">
        <img class="portrait" src="{{ 'assets/me.jpg'}}" />
    </div>
    <p class="center">
      Currently:
      <br />
      Cryptography Engineer & Researcher @ <a href="https://o1labs.org">O(1) Labs</a>/Mina
      <br />
      Co-founder @ <a href="https://leakix.net">LeakIX</a>
    </p>
    <p class="center">
      Previously:
      <br />
      Cryptography engineer @ Nomadic Labs/Tezos
      <br />
      Software engineer @ B2C2
      <br />
      Software engineer @ Be Sport
      <br />
      Gallium team @ INRIA Paris
    </p>
    <div class="center">
       <a href="https://twitter.com/dwillems42" class="logo-link">
         <img class="logo" src="{{ 'assets/twitter.svg' }}">
       </a>
       <a href="https://github.com/dannywillems" class="logo-link">
         <img class="logo" src="{{ 'assets/github.svg' }}" >
       </a>
       <a href="https://gitlab.com/dannywillems" class="logo-link">
         <img class="logo" src="{{ 'assets/gitlab.svg' }}" >
       </a>
       <a href="https://linkedin.com/in/bedannywillems" class="logo-link">
         <img class="logo" src="{{ 'assets/linkedin.svg' }}">
       </a>
    </div>
    <div class="center">
       <a href="https://leakix.net" class="logo-link">
         <img class="logo" src="{{ 'assets/leakix.svg' }}">
       </a>
       <a href='http://www.catb.org/hacker-emblem/'>
         <img src="{{ 'assets/Glider.svg' }}" alt='hacker emblem' class="logo" />
       </a>
       <a href='https://www.iacr.org/cryptodb/data/author.php?authorkey=12524'>
         <img src="{{ 'assets/iacrlogo_small.png' }}" alt='iacr_logo' class="logo" />
       </a>
    </div>
  </div>
  <div class="col-6">
    Hi! I am Danny Willems.
    I try to use my developer and mathematician skills to build softwares,
    libraries and companies to reach a better society according to my values. My
    values include, but are not restricted to, privacy, egalitarianism
    and more recently veganism.
    When possible, my work is released publicly in open-source and for
    free.
    <br />
    I spend most of my time <b>trying</b> to provide a better Internet for
    everyone.
    With this mission in mind, I co-founded <a
    href="https://leakix.net">LeakIX</a> with Gregory Boddin and we
    aim to be the Internet red team. I am also a cryptography engineer at <a
    href="https://o1labs.org">o1Labs</a>, a company catalyzing a new generation
    of applications powered by zero-knowledge cryptography.
    <br />
    My current interest in cryptography is incrementally verifiable computation. I
    have also been interested in arithmetization-oriented cryptographic primitives.
    On my free-time I read about cybersecurity, low-level code optimizations, formal
    verification and mathematics applied to physics. I also enjoy doing recreational
    mathematics.
    <br />
    Nowadays, I like getting my hands dirty coding in C, OCaml, Rust and read
    assembly code. Constantly requiring to be in an intellectually stimulating
    environment.
    <br />
    Regarding my personality, I am a curious person, I appreciate debating
    respectfully. I enjoy being surrounded by self-minded and respectful people,
    but I need to be in my world more than the average. In public, I might act
    as an introvert, but you will see sparkles in my eyes if you start talking
    about maths, computer sciences or sciences in general.
    <br />
  </div>
</div>

## Research publications

<div class="publications">
  <div class="publication-item">
    <p class="publication-title">
        New Design Techniques for Efficient
        Arithmetization-Oriented Hash Functions:Anemoi Permutations and Jive
        Compression Mode
    </p>
    <p class="publication-description">
       Advanced cryptographic protocols such as Zero-knowledge (ZK) proofs of
       knowledge, widely used in cryptocurrency applications such as Zcash, Monero,
       Filecoin, demand new cryptographic hash functions that are efficient not only
       over the binary field $\mathbb{F}_{2}$, but also over large fields of
       prime characteristic $\mathbb{F}_{p}$.
       This need has been acknowledged by the wider community and new so-called
       Arithmetization-Oriented (AO) hash functions have been proposed, e.g. MiMC-Hash,
       Rescue–Prime, Poseidon, Reinforced Concrete and Griffin to name a few.
    </p>
    <p class="publication-authors">
      Clémence Bouvier and Pierre Briaud and Pyrros Chaidos and Léo Perrin and
      Robin Salen and Vesselin Velichkov and Danny Willems
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://eprint.iacr.org/2022/840">
        PDF
      </a>
      <a class="publication-link" href="https://anemoi-hash.github.io">
        Website
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">
      New optimization techniques for PlonK’s
      arithmetization
    </p>
    <p class="publication-description">
       PlonK is a universal and updatable zk-SNARK for general circuit satisfiability
       that allows a verifier to check the validity of a certain NP statement very
       efficiently, optionally in zero-knowledge. PlonK requires that the NP relation
       of interest be expressed as a system of so-called PlonK constraints. Such
       conversion is complex and can be implemented in various ways, having a great
       impact on the prover complexity (which is typically linearithmic in the number
       of PlonK constraints).
       <br />
       We propose several general results for simplifying PlonK constraint systems,
       which produce more compact but equivalent systems and can lead to significant
       performance improvements. We also develop an automated optimizer of constraints,
       based on our techniques, that can be used to construct very compact and less
       error-prone constraint systems, favoring a more auditable circuit design.
    </p>
    <p class="publication-authors">
      Miguel Ambrona, Anne-Laure Schmitt, Raphael R. Toledo, and Danny Willems
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://eprint.iacr.org/2022/462">
        PDF
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">
      To a typed language for modular programming
    </p>
    <p class="publication-description">
      Modular programming consists of splitting programs in components called modules.
      In the functional programming language OCaml, the core and the module
      language are ruled by different typing systems.
      In this work, based on the calculus DOT, we develop a typing system and a
      subtyping algorithm for a language where the core and module languages
      are indistinguishable. For instance, functions and functors have the same
      types and records and modules are not different objects.
      We also describe a surface language "à la ML" making it easy to write programs. In
      addition to that, we provide an OCaml implementation of the typing and
      subtyping algorithm.
    </p>
    <p class="publication-authors">
      Danny Willems, master thesis directed by <a
      href="https://pauillac.inria.fr/~fpottier/">François Pottier</a>
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://github.com/dannywillems/master-thesis/">
        PDF
      </a>
      <a class="publication-link" href="https://github.com/dannywillems/RML/">
        Implementation
      </a>
    </div>
  </div>
</div>

## Public talks

<div class="publications">
  <div class="publication-item">
    <p class="publication-title">A zkVM for the MIPs architecture and OP fault proofs</p>
    <p class="publication-description">
      Invite from <a href="https://www.7xvc.com/">SevenX Venture</a> to talk
      about the recent work about the zkVM we have been working on at O(1) Labs
    </p>
    <p class="publication-authors">
      Danny Willems
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://www.youtube.com/watch?v=hR1lwvc3LBg">
        YouTube
      </a>
      <a class="publication-link" href="https://lu.ma/ResearchDay">
        Event
      </a>
      <a class="publication-link" href="https://twitter.com/yuxiao_deng/status/1732762740727660929">
        Twitter thread
      </a>
    </div>
  </div>
  <div class="publication-item">
    <p class="publication-title">ZKProof5 - Anemoi & Jive: New Arithmetization-Oriented tools for Plonk app</p>
    <p class="publication-description">
      Invitation to give a talk during ZKProof5 in Tel Aviv to present the work on Anemoi & Jive, available
      <a href="https://eprint.iacr.org/2022/840">here</a>.
    </p>
    <p class="publication-authors">
      Clémence Bouvier and Danny Willems
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://www.youtube.com/watch?v=3EdbLiClFPI">
        YouTube
      </a>
      <a class="publication-link" href="https://zkproof.org/events/workshop5/">
        Conference
      </a>
    </div>
  </div>
</div>

## Open source software contributions

<div class="publications">
  <div class="publication-item">
    <p class="publication-title">
      Octez: an OCaml implementation of the Tezos protocol (Dec 2019 - Present)
    </p>
    <p class="publication-description">
    Tezos is a blockchain that offers both consensus and meta-consensus, by which we
    mean that Tezos comes to consensus both about the state of its ledger, and also
    about how the protocol and the nodes should adapt and upgrade.
    For more information about the project, see <a href="https://tezos.com">https://tezos.com</a>.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/tezos/tezos/">
        GitLab
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-bls12-381: an efficient OCaml implementation of the pairing-friendly curve BLS12-381 (January 2020 - Present)</p>
    <p class="publication-description">
      This library provides a fast implementation of operations over the scalar field,
      including (i)FFT, operations over the groups G1 and G2, including EC-FFT,
      hash_to_curve as described in <a
      href="https://datatracker.ietf.org/doc/draft-irtf-cfrg-hash-to-curve/">this
      specification</a> and the pippenger algorithm for
      fast multi scalar exponentiation, operations over the target group of the
      pairing (GT), written additively, and pairing from $G1 x G2 to GT$.
      Notable users include Octez, an OCaml implementation of the Tezos
      protocol to allow arithmetic operations over BLS12-381 in the smart
      contract language Michelson.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/ocaml-bls12-381/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/bls12-381/">
        OPAM
      </a>
      <a class="publication-link" href="https://discuss.ocaml.org/t/ann-bls12-381-3-0-0/9438">
        First release announcement
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-bls12-381-hash: efficient C and OCaml implementation of hash functions over the scalar field of BLS12-381 (Aug. 2022 - Present)</p>
    <p class="publication-description">
      This library provides efficient C and OCaml factory implementations of
      hash functions like <a href="https://eprint.iacr.org/2022/840">Anemoi</a>, <a href="https://eprint.iacr.org/2019/458">Poseidon</a>, <a
      href="https://eprint.iacr.org/2019/426">Rescue</a> or <a href="https://eprint.iacr.org/2022/403">Griffin</a> over the scalar field of
      BLS12-381.
      Notable users include Plompiler, a monadic Domain Specific Language
      embedded in OCaml that can be used to build circuits for aPlonK.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/ocaml-bls12-381-hash/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/bls12-381-hash/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-bls12-381-signature: OCaml implementation of BLS signature for BLS12-381 (June 2021 - Present)</p>
    <p class="publication-description">
       The library provides BLS signatures for the pairing friendly curve
       BLS12-381. The code follows the specification available <a
       href="https://datatracker.ietf.org/doc/pdf/draft-irtf-cfrg-bls-signature-04.pdf">here</a>.
       Notable users include Transactionnal Rollups (TORU) and Smart Contract Rollups (SCORU), scaling solutions implemented in
       Octez, an OCaml implementation of the Tezos protocol.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/ocaml-bls12-381-signature/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/bls12-381-signature/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">Plompiler: a monadic Domain Specific Language
    embedded in OCaml than can be used to build circuits for aPlonK (2021 - Present)</p>
    <p class="publication-description">
      Programs written in Plompiler are typed to increase safety and can be
      compiled to their circuit representations or interpreted directly in
      OCaml for testing.
      Together with the circuit, Plompiler also returns an efficient
      one-pass solver that given an input finds a valid assignment for the
      wires of the circuit.
      Additionally, Plompiler contains a generic optimizer capable of
      significantly reducing the size of commonly developed circuits.
      Flamegraphs can be generated to inspect the generated circuits
      and guide the optimization of each primitives.
      The library also features a highly performant set of primitives for
      hashing (Poseidon and Anemoi) and signing.
      My contribution are sporadic, e.g. when a new primitive has to be
      implemented or when peer-coding with the cryptography team at Nomadic
      Labs.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/nomadic-labs/cryptography/privacy-team/-/tree/master/plompiler">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/tezos-plompiler">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">Mec: Modular Experimental Cryptography library in OCaml (April 2020 - Present)</p>
    <p class="publication-description">
      Mec provides modular implementations of (prime) finite field and elliptic
      curve cryptographic primitives like hash functions and signature schemes.
      The library aims to ease the development of (modular) experimental
      protocols in OCaml and does not aim to be used in a production environment.
      Notable users include Epoxy, an implementation of validity rollups
      integrated as a first class citizen in the Tezos protocol, for testing purposes.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/nomadic-labs/cryptography/ocaml-ec/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/mec/">
        OPAM
      </a>
    </div>
  </div>
  <div class="publication-item">
    <p class="publication-title">ocaml-ff: Finite Field library in OCaml (April 2020 - Present)</p>
    <p class="publication-description">
      Ff provides module types to describe (prime) finite fields
      $\mathbb{F}_{p^n}$ and provides functors to easily instantiate
      implementations.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/nomadic-labs/cryptography/ocaml-ff/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/ff/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-polynomial: polynomial over finite fields
    in OCaml (April 2020 - Present)</p>
    <p class="publication-description">
      The library provides implementations of polynomials over finite fields,
      including routines like (i)FFT.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/nomadic-labs/cryptography/ocaml-polynomial/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/polynomial/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-chia-vdf: OCaml wrapper for Chia's class
    group based VDF (May 2022)</p>
    <p class="publication-description">
    OCaml wrapper for <a href="https://github.com/Chia-Network/chiavdf">Chia's class group based VDF project</a>.
    <br />
    Notable users include the Tezos' protocol Kathmandu to improve the randomness generation.
    <br />
    My contribution has been mostly at the beginning of the project, consisting
    of writing the OCaml bindings to the C++ codebase.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/nomadic-labs/cryptography/ocaml-chia-vdf/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/class_group_vdf/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-carray: contiguous C arrays in OCaml (May 2022 - Present)</p>
    <p class="publication-description">
      OCaml arrays are not always contiguous piece of memory, requiring accessing
      different chunks of memory when accessing individual elements. When requiring a
      value in memory, the CPU will fetch the RAM and load not only the particular
      value but a memory page (a contiguous piece of memory) and add it to its cache.
      The CPU will use its cache to load the values in its registers. It is not
      efficient with large OCaml arrays as the CPU will constantly fetch the RAM to
      load different memory pages in its cache.
      Also, when using the C FFI, the user must know the memory representation of an
      array and use the non user-friendly low-level interface macro Field.
      <br />
      This library provides a polymorphic interface mocking a subset of the Array
      interface to work with contiguous piece of memory. Using the library should be
      as easy as adding module Array = Carray.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/ocaml-carray/">
        GitLab
      </a>
      <a class="publication-link" href="https://opam.ocaml.org/packages/carray/">
        OPAM
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">
        Seum: OCaml DSL and tool to write and compare programs in assembly, in a typed and "safe" fashion way (June 2022 - Present)
    </p>
    <p class="publication-description">
        Writing performant applications might require to write low level assembly code
        following a specific assembler syntax like GAS or NASM and when the code is
        written, OCaml developers must write boilerplate code in C and in OCaml to bind
        the hand-written assembly routines to expose it into a library.
        Also, comparing two routines implementing the same algorithm in
        assembly is hard because they might be implemented in different assembler, might
        use different ISA or request access a different number of time the memory.
        <br />
        Seum aims to embed a syntax close to the NASM syntax in OCaml to write typed
        assembly program. Parsers for different assemblers are provided to be able to
        compare programs using the internal Seum representation. A cost model is
        implemented counting the number of CPU cycle each instruction requires in
        addition to counting the number of memory accesses and registers used, providing
        more precise comparisons of algorithm implementations.
        Additionnally, using the embedded syntax, OCaml bindings to the assembly code can be
        automatically generated. Calling the assembly code directly from OCaml like any
        other function should also be possible and straightforward. The OCaml developer
        has never to write assembly in a different file and can threat assembly code
        like pure OCaml functions.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/seum/">
        GitLab
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">ocaml-arkworks: OCaml binding to Rust library arkworks (Dec 2022 - Present)</p>
    <p class="publication-description">
    WIP (Dec. 2022) - Optimised OCaml binding to the library <a
    href="https://github.com/arkworks">arkworks</a>. Investigating the
    replacement of the low level library used by <a
    href="https://research-development.nomadic-labs.com/files/cryptography.html">Epoxy</a>,
    the validity rollup framework built for the Tezos protocol.
    More info to come.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://gitlab.com/dannywillems/ocaml-arkworks/">
        GitLab
      </a>
    </div>
  </div>


  <div class="publication-item">
    <p class="publication-title">Ocsigen - Ocsigen Start (July 2016 - Dec 2016)</p>
    <p class="publication-description">
      Ocsigen Start is a set of higher-level libraries for building
      client-server web applications with Ocsigen (<a
      href="https://github.com/ocsigen/js_of_ocaml/">Js_of_ocaml</a> and <a
      href="https://github.com/ocsigen/eliom">Eliom</a>).
      It provides modules for user managements (session management,
      registration, action — e.g., activation — keys, ...), managing groups of
      users, displaying tips, and easily sending notifications to the users.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://github.com/ocsigen/ocsigen-start">
        GitLab
      </a>
    </div>
  </div>


  <div class="publication-item">
    <p class="publication-title">ocaml-cordova: build mobile applications using OCaml and Cordova</p>
    <p class="publication-description">
      A list of OCaml bindings to build mobile applications in OCaml using the web framework Cordova.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://github.com/dannywillems/ocaml-cordova-plugin-list">
        GitHub
      </a>
    </div>
  </div>
</div>

## CV

<div class="publications">
  <div class="publication-item">
    <p class="publication-title">
      O(1) Labs - Cryptography Engineer --- 2023 - Present
    </p>
    <p class="publication-description">
    O(1) Labs is a global and remote company that incubated the Mina Protocol. Our
    team operates on the cutting edge of Web3 and zero-knowledge-proofs.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://o1labs.org">
        O(1) Labs
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">LeakIX - CEO --- 2021 - Present</p>
    <p class="publication-description">
      LeakIX is the first platform combining a search engine indexing public
      information by scanning Internet and an open reporting platform linked to the
      results.
      <br />
      We intent to provide a preemptive solution by trusting individual researchers
      and security companies on the most sensible data we index by delivering a clear
      report on the incidents, we also help to identify what information has/could be
      affected and how to resolve the issue.
      <br />
      Our first goal is one of prevention, all the voluntary reports are free
      and no sales attempts are made on LeakIX's side.
      <br />
      We ban sales attempt that would take advantage of the issue to sell shady security services.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://leakix.net">
        Website
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">
      Nomadic Labs - Cryptography Engineer --- 2020 - 2023
    </p>
    <p class="publication-description">
      Nomadic Labs are Tezos blockchain experts. Working on the core
      development, evolution and adoption of the Tezos protocol in BENELUX.
      <br />
      Working in the cryptography team, focusing on the development on
      zero-knowledge protocols, mainly the project Epoxy, a validity rollup for
      the Tezos protocol. See <a href="#open-source-software-contributions">my
      open source contributions</a> for a (non-exhaustive) list of work
      contributiosn. Check <a href="https://gitlab.com/dannywillems/">my
      GitLab</a> and <a href="https://github.com/dannywillems">my GitHub</a> for
      my coding activity.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://research-development.nomadic-labs.com/files/cryptography.html">
        Cryptography team website
      </a>
      <a class="publication-link" href="https://nomadic-labs.com">
        Nomadic Labs
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">
      B2C2 - Blockchain lead & Software Engineer ---
      March 2017 - January 2020
    </p>
    <p class="publication-description">
    Lead developer/engineer on the accounting system (partially the risk system),
    including a real time crypto/FIAT transaction detection across multiple
    blockchains.Managing the infrastructure, the development, the release and the
    new features around the blockchain and accounting projects.
    Working on some parts of the trading system too. In general, participating
    in the main developer tasks.
    <br />
    B2C2 is a leading cryptocurrency marketmaker.
    <br />
    Brokers, exchanges, hedge funds and family offices around the world trust us
    to deliver seamless execution in the major cryptocurrencies and fiat
    currency pairs.
    <br />
    We provide 24/7/365 liquidity for Bitcoin, Ethereum, Litecoin, Bitcoin Cash,
    Ripple, and Ethereum Classic in USD, GBP, EUR, JPY, SGD, AUD, CAD, CHF and
    more. We also offer synthetic exposure to crypto.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://b2c2.com">
        Website
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">Be Sport - Intern --- July 2016 - November 2016</p>
    <p class="publication-description">
    Social network around sports.
    <br />
    The platform is built using OCaml and the Ocsigen technology. During the
    internship, I was responsible to improve the framework Ocsigen Start, which
    consists of a template to bootstrap a complete standard applications require
    users management, displaying tips, sending notifications to the users. The
    template allows to build the server and the client services, and can
    generate mobile applications using Cordova.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://besport.com">
        Be Sport
      </a>
      <a class="publication-link" href="https://ocsigen.com">
        Ocsigen
      </a>
      <a class="publication-link" href="https://github.com/ocsigen/ocsigen-start">
        Ocsigen Start
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">Selfpharma - Cordova mobile applicaiton engineer --- August 2015 - February 2016</p>
    <p class="publication-description">
    Online pharmacy shop based in Brussels, Belgium, built using Prestashop.
    Leading the iOS and Android mobile applications development, written in
    Cordova.
    <br />
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://selfpharma.com">
        Website
      </a>
      <a class="publication-link" href="https://play.google.com/store/apps/details?id=com.selfpharma.selfpharma&hl=fr">
        Play Store
      </a>
      <a class="publication-link" href="https://apps.apple.com/be/app/selfpharma/id1007247480">
        Apple Store
      </a>
    </div>
  </div>

</div>

## Education

<div class="publications">
  <div class="publication-item">
    <p class="publication-title">
      Master's Degree Mathematics and Computer Sciences - University of Mons (2012 -- 2017)
    </p>
    <p class="publication-description">
      Grade: Summa Cum Laude
      <br />
      Bachelor degree: minor in Physics.
      Awarded with the price of the Mathematics Department.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://math.umons.ac.be/en/">
        UMONS - Mathematics Department
      </a>
      <a class="publication-link" href="https://github.com/dannywillems/RML">
        Master Thesis
      </a>
    </div>
  </div>

  <div class="publication-item">
    <p class="publication-title">42 - Paris (2014)</p>
    <p class="publication-description">
      Pischine C in July 2014, joined in 2015. Stopped 1 year after to focus on
      master degree in mathematics at UMONS.
    </p>
    <div class="publication-links">
      <a class="publication-link" href="https://42.fr/en/homepage/">
        Website
      </a>
    </div>
  </div>
</div>


## Quotes

<blockquote>
Le savoir est une arme, mais personne braque pour acheter des livres -- Kery James
</blockquote>

<blockquote>
A mathematician who is not also something of a poet will never be a complete mathematician. -- Karl Weierstrass

</blockquote>

<blockquote>
Arguing that you don't care about the right to privacy because you have nothing
to hide is no different than saying you don't care about free speech because you
have nothing to say -- Edward Snowden
</blockquote>

<blockquote>
Never attribute to malice that which is adequately explained by stupidity -- <a href="https://en.wikipedia.org/wiki/Hanlon%27s_razor">Hanlon's razor</a>
</blockquote>

<blockquote>
Je préfère l'eau potable pour tous que le champagne pour quelques potes -- Médine
</blockquote>

<blockquote>
Celui qui se contente de peu ne manque de rien
</blockquote>

<blockquote>
On est condamné à réussir, à franchir des barrières, construire des carrières.
Regarde ce qu'on accomplit nos parents, ce qu'ils ont subi pour qu'on accède à
l'éducation. Où serait-on sans leurs sacrifices ? Bien sûr que le travail a du
mérite. O combien j'admire nos pères. Peut-être manutentionnaires mais fiers. Si
on gâche tout où est le respect ? Si on échoue où est le progrès ? Chaque fils
de pauvre doit avoir de l'ambition.
</blockquote>

<blockquote>
Hardly anybody actually understands money - <a href="http://unenumerated.blogspot.com/2011/05/bitcoin-what-took-ye-so-long.html">Nick Szabo</a>
</blockquote>

## Recommended softwares

- [KeepassXC](https://keepassxc.org/): see [my
  thread](https://twitter.com/dwillems42/status/1665316530035347457) on Twitter.

## Must read

<ul>
  <li>A Cypherpunk's Manifesto - Eric Hughes - https://www.activism.net/cypherpunk/manifesto.html</li>
  <li> How To Become A Hacker - Eric Steven Raymond - http://www.catb.org/~esr/faqs/hacker-howto.html
</li>
</ul>


<!-- ## Recent scientific readings -->

<!-- Here will come my notes on scientific papers/article I read. Mostly to keep a -->
<!-- personal historic but also to share it publicly. -->
