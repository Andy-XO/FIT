import React from 'react';
import { motion } from 'framer-motion';
import { profile, checklist, healthFlags } from './data/profile';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Section({ id, refCb, align = 'center', children }) {
  const justify =
    align === 'left' ? 'md:justify-start' : align === 'right' ? 'md:justify-end' : 'md:justify-center';
  return (
    <section
      id={id}
      ref={refCb}
      className={`relative min-h-screen w-full flex items-center justify-center ${justify} px-5 py-24 md:px-16`}
    >
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full max-w-xl"
      >
        {children}
      </motion.div>
    </section>
  );
}

function Chip({ k, v, flag }) {
  return (
    <div className="glass px-4 py-3">
      <div className="eyebrow mb-1 text-[9.5px]">{k}</div>
      <div className={`mono text-lg font-semibold ${flag ? 'text-rust2' : 'text-ink'}`}>{v}</div>
    </div>
  );
}

function CheckItem({ id, item, isChecked, toggle, accent }) {
  const on = isChecked(id);
  return (
    <li className="border-t border-white/5 first:border-0">
      <button
        onClick={() => toggle(id)}
        className="flex w-full items-start gap-3 py-2.5 text-left transition-colors hover:bg-white/[0.03] rounded-lg px-1"
      >
        <span
          className="mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] border-2 text-[11px] font-bold transition-all"
          style={{
            borderColor: accent,
            background: on ? accent : 'transparent',
            color: '#05100c',
          }}
        >
          {on ? '✓' : ''}
        </span>
        <span className={`flex-1 text-[13.5px] leading-snug ${on ? 'text-ink/45 line-through' : 'text-ink/90'}`}>
          {item.t}
          {item.note && <span className="mt-0.5 block text-[11.5px] text-ink/40 no-underline">{item.note}</span>}
        </span>
      </button>
    </li>
  );
}

function GroupCard({ group, isChecked, toggle, accent = '#3ddc97', alert }) {
  return (
    <motion.div
      variants={reveal}
      className={`glass p-5 ${alert ? 'border-rust2/40 bg-[rgba(40,15,10,0.5)]' : ''}`}
    >
      <div className="mb-3 flex items-baseline gap-2.5 border-b border-white/10 pb-2.5">
        <span className="mono text-[11px] font-bold" style={{ color: alert ? '#c85a3c' : '#e9a100' }}>
          {group.num}
        </span>
        <h3 className={`text-[15px] font-extrabold tracking-tight ${alert ? 'text-rust2' : 'text-ink'}`}>
          {group.title}
        </h3>
      </div>
      <ul className="list-none p-0 m-0">
        {group.items.map((item, i) => (
          <CheckItem
            key={i}
            id={`${group.num}-${i}`}
            item={item}
            isChecked={isChecked}
            toggle={toggle}
            accent={alert ? '#c85a3c' : accent}
          />
        ))}
      </ul>
    </motion.div>
  );
}

export default function Overlay({ setRef, checklistApi }) {
  const { isChecked, toggle, reset, completion, count, totalItems } = checklistApi;
  const pct = Math.round(completion * 100);

  return (
    <div className="overlay">
      {/* 0 · HERO */}
      <Section id="hero" refCb={setRef(0)} align="center">
        <div className="text-center md:text-left">
          <p className="eyebrow mb-4">Fat-Loss System · derived from your {profile.scan} scan</p>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight">
            The <span className="text-emerald2">Transformation</span>
          </h1>
          <p className="mt-5 max-w-md text-ink/60 text-[15px] mx-auto md:mx-0">
            Not a checklist on paper - your body, your numbers, and your plan rendered as a world you
            move through. Scroll to begin the descent.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto md:mx-0">
            <Chip k="Target" v={`${profile.targetKcal} kcal`} />
            <Chip k="Protein" v={`${profile.protein} g`} />
            <Chip k="Pace" v={`~${profile.paceKgPerWeek} kg/wk`} />
            <Chip k="Visceral fat" v={`${profile.visceralFat} ⚠`} flag />
          </div>
          <p className="mono mt-10 text-[11px] text-ink/40 animate-pulse">↓ scroll</p>
        </div>
      </Section>

      {/* 1 · BODY COMPOSITION */}
      <Section id="composition" refCb={setRef(1)} align="right">
        <div className="glass p-7">
          <p className="eyebrow mb-3">01 · Where the mass sits</p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Body composition</h2>
          <p className="text-ink/65 text-[14px] leading-relaxed">
            The glowing core is your <b className="text-emerald2">{profile.leanKg} kg of lean mass</b> - the
            engine you protect. Around it, the amber shell is <b className="text-amber2">{profile.fatKg} kg of
            fat</b> ({profile.bodyFatPct}%). The small red orb is <b className="text-rust2">visceral fat</b> at
            17 - the number that matters most for your health.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Chip k="Weight" v={`${profile.weightKg} kg`} />
            <Chip k="Body fat" v={`${profile.bodyFatPct}%`} />
            <Chip k="Waist-hip" v={profile.waistHip} flag />
          </div>
        </div>
      </Section>

      {/* 2 · JOURNEY */}
      <Section id="journey" refCb={setRef(2)} align="left">
        <div className="glass p-7">
          <p className="eyebrow mb-3">02 · The descent</p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">116 → 97 → 88</h2>
          <p className="text-ink/65 text-[14px] leading-relaxed">
            At <b>~{profile.paceKgPerWeek} kg per week</b>, the path bends downward in stages. First
            checkpoint: <b className="text-teal2">~95-100 kg / ~25%</b> - re-scan there. Then keep the loop
            running: <span className="mono text-ink/80">Lose → Reward → Reset → Adjust → Repeat.</span>
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {profile.journey.map((c) => (
              <div key={c.label} className="flex items-center justify-between glass px-4 py-2.5">
                <span className="mono text-[13px] text-ink/85">{c.label}</span>
                <span className="mono text-[13px] font-semibold text-emerald2">{c.weight} kg · {c.bf}%</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 3 · FUEL - center stays clear so all four 3D rings read through */}
      <section
        id="targets"
        ref={setRef(3)}
        className="relative min-h-screen w-full flex flex-col items-center justify-between px-5 py-24 text-center"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="max-w-md"
        >
          <p className="eyebrow mb-3">03 · Daily fuel</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Hit these every day</h2>
          <p className="text-ink/55 text-[13.5px] mt-2 leading-relaxed">
            {profile.targetKcal} kcal across <b>{profile.meals} meals</b> of ~{profile.kcalPerMeal} kcal. The
            rings are calories, protein, carbs and fats - protein is the one you never let drop.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <Chip k="Water" v={`${profile.waterL} L`} />
          <Chip k="Fibre" v={`${profile.fibreG} g`} />
          <Chip k="Steps" v={profile.steps} />
          <Chip k="Sleep" v={`${profile.sleepH} h`} />
        </motion.div>
      </section>

      {/* 4 · THE SYSTEM (interactive checklist) */}
      <Section id="system" refCb={setRef(4)} align="center">
        <div className="w-full max-w-3xl -mx-1">
          <div className="text-center mb-6">
            <p className="eyebrow mb-3">04 · The system</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Tick it. It saves.</h2>
            <p className="text-ink/55 text-[13.5px] mt-2">
              Daily ones every day, weekly ones once a week. Your ticks are stored on this device.
            </p>
          </div>

          {/* live progress */}
          <div className="glass px-5 py-4 mb-6 sticky top-4 z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="mono text-[12px] text-ink/70">
                {count}/{totalItems} done · {pct}%
              </span>
              <button onClick={reset} className="mono text-[11px] text-ink/40 hover:text-rust2 transition-colors">
                reset
              </button>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#2f5d50,#3ddc97)' }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-start">
            {checklist.map((g) => (
              <GroupCard key={g.num} group={g} isChecked={isChecked} toggle={toggle} />
            ))}
          </div>
        </div>
      </Section>

      {/* 5 · HEALTH FLAGS */}
      <Section id="flags" refCb={setRef(5)} align="center">
        <div className="w-full max-w-xl">
          <div className="text-center mb-6">
            <p className="eyebrow mb-3 text-rust2">05 · Health flags</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-rust2">Don’t push through these</h2>
          </div>
          <GroupCard group={healthFlags} isChecked={isChecked} toggle={toggle} alert />
          <div className="glass mt-5 p-5 text-[11.5px] leading-relaxed text-ink/50">
            <p className="mb-1">
              Generated from your {profile.scan} scan and the Fat Loss Fuel System.
            </p>
            <p>
              <b className="text-ink/70">Note:</b> general fitness and nutrition guidance, not medical advice.
              Confirm new supplements and any aggressive dieting with a doctor - especially given the
              visceral-fat ({profile.visceralFat}) and waist-hip ({profile.waistHip}) readings.
            </p>
          </div>
          <p className="mono text-center text-[10px] text-ink/30 mt-8">FIT Coach · built for {`{`}you{`}`}</p>
        </div>
      </Section>
    </div>
  );
}
