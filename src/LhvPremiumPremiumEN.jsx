import React, { useMemo, useState, useEffect } from "react";

/** --- € utiliidid --- */
const formatEuroInput = (n) =>
  `${Math.max(0, Math.round(n)).toLocaleString("et-EE")} €`;
const formatEuroBubble = (n) => `${Math.round(n).toLocaleString("et-EE")}€`;
const parseEuro = (s) => {
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

import PremiumHeader from "./PremiumHeader";

export default function LhvPremiumPremiumEN() {
  const inputClass =
    "w-full rounded-xl border border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2";

  // olek
  const [staatus, setStaatus] = useState("Kuldklient");
  const [arveldus, setArveldus] = useState(0);
  const [kogumis, setKogumis] = useState(0);
  const [kindlustusKuu, setKindlustusKuu] = useState(0);
  const [reisid, setReisid] = useState(0);
  const [portfell, setPortfell] = useState(0);
  const [teenUSDE, setTeenUSDE] = useState(false);
  const [tehingudKuu, setTehingudKuu] = useState(0);
  const [openConsent, setOpenConsent] = useState(false);

  function handleAccept() {
    // siia kopeeri sinu senine onClick sisu
    setStaatus("Kuldklient");
    setArveldus(5000);        // Arvelduskonto
    setKogumis(20000);        // Kogumiskonto
    setKindlustusKuu(75);    // Kindlustus kuus
    setReisid(5);             // Reiside arv
    setPortfell(15000);      // Portfell
    setTeenUSDE(true);        // USA & DE checkbox
    setTehingudKuu(3);        // Tehingute arv kuus

    setOpenConsent(false);    // sulge modal
  }

  function handleClear() {
    setStaatus("Tavaklient");
    setArveldus(0);
    setKogumis(0);
    setKindlustusKuu(0);
    setReisid(0);
    setPortfell(0);
    setTeenUSDE(false);
    setTehingudKuu(0);
    setOpenConsent(false);
  }

  // abifunktsioonid
  const custodySavingsYear = useMemo(() => {
    // Premium: väärtpaberite hoidmine tasuta kuni 500k; tavau/aukliendil tasuta kuni 100k; üle selle 0,01% kuus
    // Kasu = 0,01% kuus * min(max(portfell - 100k, 0), 400k) * 12
    const kasuBaassumma = Math.min(Math.max(portfell - 100000, 0), 500000);
    const kuus = kasuBaassumma * 0.0001; // 0,01% kuus
    return kuus * 12; // aastas
  }, [portfell]);

  const fastTrackAeg = useMemo(() => {
    const min = reisid * 20; // 20 min/reis
    const h = Math.floor(min / 60);
    const m = min % 60;
    return { h, m, min };
  }, [reisid]);

  // kalkulatsioon (Premiumi AASTANE kasu võrreldes valitud staatusega)
  const voitAastas = useMemo(() => {
    // 1) Klienditasu vahe
    const kliendiKuutasuVahe = staatus === "Kuldklient" ? 13 : 20; // €/kuus rohkem võrreldes valitud staatusega
    const kliendiAastatasuVahe = kliendiKuutasuVahe * 12; // negatiivne mõju

    // 2) Arvelduskonto intress: ainult TAVAKLIENT vs Premium (+0,99%)
    const arveldusIntressAastas = staatus === "Tavaklient" ? arveldus * 0.0099 : 0;

    // 3) Kogumiskonto intress: AUKLIENT vs Premium +0,5% kuni 100k; TAVAKLIENT vs Premium +0,5% kuni 100k
    const kogumisIntressAastas = Math.min(kogumis, 100000) * 0.005;

    // 4) Kaardi kuutasu soodustus: +1 € kuus (mõlemal võrdlusel)
    const kaartKasuAastas = staatus === "Tavaklient" ? 1 * 12 : 0;

    // 5) Kindlustus: ainult AUKLIENT vs Premium (-20% kindlustusmaksetelt)
    const kindlustusKasuAastas = kindlustusKuu * 0.2 * 12;

    // 6) Väärtpaberite hoidmine: kirjeldatud ülal
    const custodyAastas = custodySavingsYear;

    // 7) USA & Saksamaa tehingutasu: vähemalt 2€ odavam/tehing
    const tehinguKasuAastas = teenUSDE ? tehingudKuu * 2 * 12 : 0;

    const tulud =
      arveldusIntressAastas +
      kogumisIntressAastas +
      kaartKasuAastas +
      kindlustusKasuAastas +
      custodyAastas +
      tehinguKasuAastas;

    const kasu = Math.round(tulud - kliendiAastatasuVahe);
    return kasu;
  }, [staatus, arveldus, kogumis, kindlustusKuu, custodySavingsYear, teenUSDE, tehingudKuu]);

  return (
    <div className=" min-h-screen text-slate-800">
      <PremiumHeader active="Eelised" />
      <div className="w-full">
        <img
          src="/tulekliendiks2.png"
          alt="Premium kampaania"
          className="w-full h-auto object-cover"
        />
      </div>
      <div style={{ backgroundColor: "#E3F6F9" }} className="min-h-screen text-slate-800">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-[60%_1px_40%] gap-10 items-start">
            {/* --- VASAK PANEEL --- */}
            <div className="space-y-6">
              {/* Kliendi staatus üle kahe veeru */}
              <div>
                <h2 className="text-xl font-semibold">Sinu kliendi staatus:</h2>
                <div className="mt-3 relative w-full md:max-w-sm">
                  <select
                    aria-label="Kliendi staatus"
                    className={inputClass + " pr-10"}
                    value={staatus}
                    onChange={(e) => setStaatus(e.target.value)}
                  >
                    <option>Kuldklient</option>
                    <option>Tavaklient</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></span>
                </div>
              </div>

              {/* Kaks veergu: vasakul Igapäeva, paremal Reisimine + Investeerimine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Vasak veerg: Igapäeva pangandus */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Igapäeva pangandus</h3>
                  <div className="grid grid-cols-1 gap-6 mt-24">
                    <FieldEuro
                      label="Arvelduskonto seis"
                      value={arveldus}
                      onChange={setArveldus}
                    />
                    <FieldEuro
                      label="Kogumiskonto seis"
                      value={kogumis}
                      onChange={setKogumis}
                    />
                    <FieldEuro
                      label="Kindlustusmaksed kuus (kasko + kodu)"
                      value={kindlustusKuu}
                      onChange={setKindlustusKuu}
                    />
                  </div>
                </div>

                {/* Parem veerg: üleval Reisimine, all Investeerimine */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold">Reisimine</h3>
                    <label className="block text-sm mb-2 mt-4">
                      Keskmine reiside arv aastas <strong>{reisid}</strong>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={1}
                      value={reisid}
                      onChange={(e) => setReisid(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Investeerimine</h3>
                    <div className="gap-2 mt-2">
                      <FieldEuro label="Portfell" value={portfell} onChange={setPortfell} />
                    </div>
                    <label className="mt-3 flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={teenUSDE}
                        onChange={(e) => setTeenUSDE(e.target.checked)}
                        className="h-5 w-5 rounded"
                      />
                      <span className="text-sm">Teen tehinguid USA ja Saksamaa börsidel</span>
                    </label>
                    {/* Nähtav ainult siis, kui teenUSDE on true */}
                    {teenUSDE && (
                      <div className="mt-8">
                        <label className="block text-sm mb-1">
                          Tehingute arv kuus
                        </label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={tehingudKuu}
                          onChange={(e) => setTehingudKuu(Number(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  className="rounded-md bg-black text-white px-4 py-3 shadow hover:shadow-md"
                  onClick={() => setOpenConsent(true)}   // ava modal, ÄRA täida kohe
                >
                  Täida minu andmetega
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-end gap-2 rounded-md text-slate-500 bg-transparent
                            px-4 py-2 text-sm hover:border-slate-400 hover:text-slate-700 active:scale-[0.99]"
                >
                  Tühjenda
                </button>
              </div>
              <ConsentModal
                open={openConsent}
                onClose={() => setOpenConsent(false)}    // "Ei nõustu" või taustale klikk
                onAccept={handleAccept}                  // "Nõustun" täidab väljad
                text="Kas annad nõusoleku täita väljad sinu vaikimisi andmetega?"
              />
            </div>

            {/* Eraldusjoon */}
            <div className="hidden md:block w-px bg-slate-200 h-full" />

            {/* --- PAREM PANEEL: tulemus --- */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Sinu võit aastas:</h2>
              <div className="mt-4 text-6xl font-extrabold tracking-tight bg-white rounded-2xl shadow p-6 w-full">
                {formatEuroBubble(voitAastas)}
              </div>

              <div className="mt-8 space-y-6">
                {/* Kindlustuse kasu (ainult Au-klient vs Premium) */}
                {kindlustusKuu > 0 && (
                  <PerkLine
                    left={`${Math.round(kindlustusKuu * 0.2 * 12).toLocaleString("et-EE")}€`}
                    middle={"–20% kindlustusmaksetelt aastas"}
                  />
                )}

                {/* Custody kasu */}
                {custodySavingsYear > 0 && (
                  <PerkLine
                  left={`${Math.round(custodySavingsYear).toLocaleString("et-EE")}€`}
                  middle={"Välisväärtpaberite hoidmise tasu kokkuhoid"}
                />
                )}

                {/* USA/DE tehingu tasu kasu */}
                {teenUSDE && tehingudKuu > 0 && (
                  <PerkLine
                    left={`${(tehingudKuu * 2 * 12).toLocaleString("et-EE")}€`}
                    middle={"vähemalt 2€ odavam tehingutasu USA ja Saksa börsidel"}
                  />
                )}
                {((fastTrackAeg.h > 0 || fastTrackAeg.m > 0) || staatus === "Tavaklient") && (
                  <h3 className="font-semibold">Lisaks:</h3>
                )}
                {/* FastTrack ajavõit */}
                {(fastTrackAeg.h > 0 || fastTrackAeg.m > 0) && (
                  <PerkLine
                    left={
                      fastTrackAeg.h > 0
                        ? `${fastTrackAeg.h} h ${fastTrackAeg.m} min`
                        : `${fastTrackAeg.m} min`
                    }
                    middle={"ajakokkuhoidu tänu Fast Trackile (20 min/reis)"}
                  />
                )}

                {/* Tava vs Premium lisaboonus: Balti analüüsid (kirjelduslik) */}
                {staatus === "Tavaklient" && (
                  <PerkLine left="Tasuta ligipääs Balti analüüsidele" />
                )}
              </div>

              <div className="mt-10">
                <button className="w-full rounded-lg bg-black text-white px-4 py-3 shadow hover:shadow-md">
                  Sõlmi Premium leping
                </button>
              </div>

              {/* Selgitus kasutatud loogikast */}
              <div className="mt-6 text-xs text-slate-500 leading-relaxed">
                <p>
                  Arvutused põhinevad LHV hinnakirjal, kehtivad alates 2025.
                </p>
                <p>
                  Premiumi klienditasu vahe {""}
                  {staatus === "Kuldklient" ? "10€ / kuus" : "20€ / kuus"};
                  kogumiskonto lisaintress {""}
                  {staatus === "Kuldklient" ? "+0,5% kuni 100 000€" : "+0,5% kogu summalt"};
                  arvelduskonto lisaintress {""}
                  {staatus === "Tavaklient" ? "+0,99%" : "puudub"};
                  kindlustus –20%;
                  väärtpaberite hoidmine: tasuta kuni 500 000€ ning üle selle 0,01% kuus; 
                  USA & DE tehingutasu vähemalt 2€ odavam.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full">
          <img
            src="/tingimused.png"
            alt="Premium kampaania"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="w-full">
          <img
            src="/footer.png"
            alt="Premium kampaania"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/** --- Vormiväli eurodega --- */
function FieldEuro({ label, value, onChange }) {
  const [raw, setRaw] = useState(formatEuroInput(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(formatEuroInput(value));
  }, [value, focused]);

  const handleStep = (delta) => {
    const newValue = Math.max(0, value + delta);
    onChange(newValue);
    setRaw(formatEuroInput(newValue));
  };

  return (
    <label className="block">
      <span className="block text-sm mb-1">{label}</span>
      <div className="flex">
        <input
          type="text"
          inputMode="numeric"
          className="w-full rounded-l-xl border border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2"
          value={focused ? String(value || "") : formatEuroInput(value)}
          onFocus={() => {
            setFocused(true);
            if (value === 0) {
              setRaw("");
            }
          }}
          onBlur={() => {
            setFocused(false);
            const n = parseEuro(raw);
            onChange(n);
            setRaw(formatEuroInput(n));
          }}
          onChange={(e) => {
            const next = e.target.value;
            setRaw(next);
            onChange(parseEuro(next));
          }}
        />
        <div className="flex flex-col border border-l-0 border-slate-300 rounded-r-xl">
          <button
            type="button"
            className="flex-1 px-1 hover:bg-slate-100"
            onClick={() => handleStep(50)}
          >
            ▲
          </button>
          <button
            type="button"
            className="flex-1 px-1 hover:bg-slate-100"
            onClick={() => handleStep(-50)}
          >
            ▼
          </button>
        </div>
      </div>
    </label>
  );
}

function PerkLine({ left, middle }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold">{left}</span>
        <span className="text-sm">{middle}</span>
      </div>
      <span className="text-xl leading-none select-none">+</span>
    </div>
  );
}


function ConsentModal({ open, onClose, onAccept, text }) {
  // (valikuline) lukusta taustkerimine, kui modal on avatud
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* taust */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* aken */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-slate-200">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Nõusolek
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {text ??
                "Kas annad nõusoleku, et täidame allolevad lahtrid vaikimisi väärtustega?"}
            </p>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onAccept}
              className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
            >
              Nõustun
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Ei nõustu
            </button>
            <button
              type="button"
              onClick={() => {/* hetkel ei tee midagi */}}
              className="rounded-md px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Loe veel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}