import { useEffect, useMemo, useState } from "react";

import {
  getMyProfile,
  updateMyProfile,
} from "../api/auth";

import {
  getMySkills,
  addSkill,
  deleteSkill,
} from "../api/skills";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  location: string | null;
  is_active: boolean;
}

interface UserSkill {
  id: number;
  skill_id: number;
  name: string;
  type: string;
  level: string | null;
}

function Profile() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [skills, setSkills] =
    useState<UserSkill[]>([]);

  const [skillName, setSkillName] =
    useState("");

  const [skillType, setSkillType] =
    useState("TEACH");

  const [skillLevel, setSkillLevel] =
    useState("");

  const [addingSkill, setAddingSkill] =
    useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const data =
          await getMyProfile();

        setProfile(data);
        setName(data.name);
        setBio(data.bio || "");
        setLocation(data.location || "");

        const skillData =
          await getMySkills();

        setSkills(skillData);
      } catch (error) {
        setError(
          "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleUpdateProfile() {
    try {
      setSaving(true);
      setMessage("");

      const data =
        await updateMyProfile(
          name,
          bio,
          location
        );

      setProfile(data.user);

      setName(data.user.name);
      setBio(data.user.bio || "");
      setLocation(
        data.user.location || ""
      );

      setMessage(
        "Profile updated successfully"
      );
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSkill() {
    if (!skillName.trim()) {
      return;
    }

    try {
      setAddingSkill(true);

      const data =
        await addSkill(
          skillName.trim(),
          skillType,
          skillLevel
        );

      setSkills((previous) => [
        ...previous,
        data.skill,
      ]);

      setSkillName("");
      setSkillLevel("");
    } catch (error: any) {
      alert(
        error.response?.data?.detail ||
          "Failed to add skill"
      );
    } finally {
      setAddingSkill(false);
    }
  }

  async function handleDeleteSkill(
    userSkillId: number
  ) {
    try {
      await deleteSkill(
        userSkillId
      );

      setSkills((previous) =>
        previous.filter(
          (skill) =>
            skill.id !== userSkillId
        )
      );
    } catch (error: any) {
      alert(
        error.response?.data?.detail ||
          "Failed to delete skill"
      );
    }
  }

  const teachingSkills =
    useMemo(
      () =>
        skills.filter(
          (skill) =>
            skill.type === "TEACH"
        ),
      [skills]
    );

  const learningSkills =
    useMemo(
      () =>
        skills.filter(
          (skill) =>
            skill.type === "LEARN"
        ),
      [skills]
    );

  const profileCompletion =
    useMemo(() => {
      let completed = 0;

      if (profile?.name?.trim()) {
        completed++;
      }

      if (profile?.email?.trim()) {
        completed++;
      }

      if (profile?.bio?.trim()) {
        completed++;
      }

      if (profile?.location?.trim()) {
        completed++;
      }

      if (skills.length > 0) {
        completed++;
      }

      return Math.round(
        (completed / 5) * 100
      );
    }, [profile, skills]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <div className="rounded-3xl border border-red-100 bg-white px-10 py-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            !
          </div>

          <p className="font-semibold text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const firstLetter =
    profile.name
      .charAt(0)
      .toUpperCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7fb]">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 top-10 h-96 w-96 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="absolute -right-40 top-40 h-[28rem] w-[28rem] animate-pulse rounded-full bg-purple-400/10 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-[-180px] left-1/3 h-[30rem] w-[30rem] animate-pulse rounded-full bg-fuchsia-300/10 blur-3xl [animation-delay:2s]" />

        {/* Floating 3D shapes */}

        <div className="absolute left-[8%] top-[18%] h-6 w-6 rotate-45 animate-bounce rounded-lg bg-indigo-400/20 [animation-duration:5s]" />

        <div className="absolute right-[12%] top-[24%] h-8 w-8 animate-pulse rounded-full bg-purple-400/20" />

        <div className="absolute bottom-[20%] left-[15%] h-5 w-5 rotate-12 animate-bounce rounded-md bg-fuchsia-400/20 [animation-duration:6s]" />

      </div>


      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:py-12">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_-35px_rgba(79,70,229,0.35)] backdrop-blur-xl">

          {/* Gradient cover */}

          <div className="absolute inset-x-0 top-0 h-48 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500">

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10 bg-white/10" />

            <div className="absolute right-20 top-12 h-20 w-20 rounded-full bg-white/10 blur-sm" />

            <div className="absolute bottom-[-60px] left-1/3 h-32 w-32 rounded-full border border-white/10 bg-white/10" />

          </div>


          <div className="relative px-6 pb-8 pt-28 sm:px-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

              {/* Identity */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                {/* 3D AVATAR */}

                <div className="group/avatar relative">

                  <div className="absolute inset-0 translate-y-4 scale-90 rounded-[2rem] bg-indigo-700/40 blur-2xl transition-all duration-700 group-hover/avatar:translate-y-6 group-hover/avatar:scale-110" />

                  <div className="absolute -inset-2 rounded-[2.2rem] border border-white/30 opacity-0 transition-all duration-500 group-hover/avatar:rotate-6 group-hover/avatar:opacity-100" />

                  <div className="relative flex h-32 w-32 rotate-[-4deg] items-center justify-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-5xl font-black text-white shadow-[0_25px_40px_-15px_rgba(79,70,229,0.6)] transition-all duration-500 group-hover/avatar:rotate-3 group-hover/avatar:scale-105">

                    <span className="drop-shadow-lg">
                      {firstLetter}
                    </span>

                  </div>

                </div>


                <div className="pb-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                      {profile.name}
                    </h1>

                    {profile.is_active && (
                      <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        Active
                      </span>
                    )}

                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {profile.email}
                  </p>

                  {profile.location && (
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs">
                        ●
                      </span>

                      {profile.location}
                    </p>
                  )}

                </div>

              </div>


              {/* PROFILE STATS */}

              <div className="grid grid-cols-3 gap-3">

                <StatCard
                  value={skills.length}
                  label="Skills"
                />

                <StatCard
                  value={
                    teachingSkills.length
                  }
                  label="Teaching"
                  accent="indigo"
                />

                <StatCard
                  value={
                    learningSkills.length
                  }
                  label="Learning"
                  accent="purple"
                />

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.35fr]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-8">

            {/* ABOUT */}

            <section className="rounded-[1.75rem] border border-white/80 bg-white/85 p-7 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_65px_-35px_rgba(79,70,229,0.25)]">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
                    About me
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-900">
                    Your story
                  </h2>
                </div>

                <div className="flex h-11 w-11 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-100 text-lg text-indigo-600 shadow-sm">
                  ✦
                </div>

              </div>

              <p className="leading-7 text-gray-600">
                {profile.bio ||
                  "You haven't added a bio yet. Tell the community a little about yourself."}
              </p>

            </section>


            {/* PROFILE COMPLETION */}

            <section className="relative overflow-hidden rounded-[1.75rem] bg-gray-900 p-7 text-white shadow-[0_25px_60px_-30px_rgba(0,0,0,0.5)]">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />

              <div className="relative">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                      Profile strength
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Keep building
                    </h2>
                  </div>

                  <span className="text-2xl font-black text-indigo-300">
                    {profileCompletion}%
                  </span>

                </div>


                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 transition-all duration-1000"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />

                </div>


                <p className="mt-4 text-sm leading-6 text-gray-400">
                  A complete profile helps people understand what you can offer and what you want to learn.
                </p>

              </div>

            </section>


            {/* EDIT PROFILE */}

            <section className="rounded-[1.75rem] border border-white/80 bg-white/85 p-7 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.3)] backdrop-blur-xl">

              <div className="mb-7">

                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
                  Settings
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  Edit profile
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Keep your community profile up to date.
                </p>

              </div>


              <div className="space-y-5">

                <InputField
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                />

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Bio
                  </label>

                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    rows={4}
                    placeholder="Tell your community about yourself..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>


                <InputField
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Your city"
                />


                <button
                  type="button"
                  onClick={
                    handleUpdateProfile
                  }
                  disabled={saving}
                  className="group/save relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="relative z-10">
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover/save:translate-x-0" />

                </button>


                {message && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                    {message}
                  </div>
                )}

              </div>

            </section>

          </div>


          {/* ================================================= */}
          {/* RIGHT - SKILLS */}
          {/* ================================================= */}

          <section className="rounded-[1.75rem] border border-white/80 bg-white/85 p-7 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.3)] backdrop-blur-xl">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
                  Skill exchange
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900">
                  My Skills
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                  Share what you know and discover what you want to learn.
                </p>

              </div>


              <div className="relative hidden sm:block">

                <div className="absolute inset-0 animate-ping rounded-2xl bg-indigo-400/20" />

                <div className="relative flex h-14 w-14 rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white shadow-lg shadow-indigo-500/30 transition-transform duration-500 hover:rotate-12 hover:scale-110">
                  ✨
                </div>

              </div>

            </div>


            {/* ADD SKILL */}

            <div className="mt-7 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 p-5">

              <div>

                <h3 className="font-black text-gray-900">
                  Add a skill
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Tell people what you can teach or what you want to learn.
                </p>

              </div>


              <div className="mt-5 space-y-3">

                <input
                  type="text"
                  value={skillName}
                  onChange={(e) =>
                    setSkillName(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. Python, Guitar, Photography"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />


                <div className="grid gap-3 sm:grid-cols-2">

                  <select
                    value={skillType}
                    onChange={(e) =>
                      setSkillType(
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >

                    <option value="TEACH">
                      I can teach
                    </option>

                    <option value="LEARN">
                      I want to learn
                    </option>

                  </select>


                  <select
                    value={skillLevel}
                    onChange={(e) =>
                      setSkillLevel(
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >

                    <option value="">
                      Select level
                    </option>

                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>

                  </select>

                </div>


                <button
                  type="button"
                  onClick={
                    handleAddSkill
                  }
                  disabled={
                    addingSkill ||
                    !skillName.trim()
                  }
                  className="w-full rounded-xl bg-gray-900 px-5 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {addingSkill
                    ? "Adding..."
                    : "+ Add Skill"}
                </button>

              </div>

            </div>


            {/* SKILLS */}

            <div className="mt-9 space-y-9">

              {/* TEACHING */}

              <SkillSection
                title="I can teach"
                subtitle="Skills you can share with others"
                count={
                  teachingSkills.length
                }
                icon="↑"
                iconClass="bg-indigo-100 text-indigo-600"
              >

                {teachingSkills.length ===
                0 ? (
                  <EmptySkills
                    text="No teaching skills yet."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">

                    {teachingSkills.map(
                      (skill) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          onDelete={
                            handleDeleteSkill
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </SkillSection>


              {/* LEARNING */}

              <SkillSection
                title="I want to learn"
                subtitle="Skills you want to explore"
                count={
                  learningSkills.length
                }
                icon="↓"
                iconClass="bg-purple-100 text-purple-600"
              >

                {learningSkills.length ===
                0 ? (
                  <EmptySkills
                    text="No learning goals yet."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">

                    {learningSkills.map(
                      (skill) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          onDelete={
                            handleDeleteSkill
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </SkillSection>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: "indigo" | "purple";
}) {
  const textColor =
    accent === "indigo"
      ? "text-indigo-600"
      : accent === "purple"
      ? "text-purple-600"
      : "text-gray-900";

  return (
    <div className="min-w-[78px] rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <p
        className={`text-2xl font-black ${textColor}`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

    </div>
  );
}


/* ========================================================= */
/* INPUT */
/* ========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
      />

    </div>
  );
}


/* ========================================================= */
/* SKILL SECTION */
/* ========================================================= */

function SkillSection({
  title,
  subtitle,
  count,
  icon,
  iconClass,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  icon: string;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black ${iconClass}`}
          >
            {icon}
          </div>

          <div>

            <h3 className="font-black text-gray-900">
              {title}
            </h3>

            <p className="text-xs text-gray-400">
              {subtitle}
            </p>

          </div>

        </div>


        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
          {count}
        </span>

      </div>

      {children}

    </div>
  );
}


/* ========================================================= */
/* EMPTY */
/* ========================================================= */

function EmptySkills({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-7 text-center">

      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        +
      </div>

      <p className="text-sm font-medium text-gray-400">
        {text}
      </p>

    </div>
  );
}


/* ========================================================= */
/* SKILL CARD */
/* ========================================================= */

function SkillCard({
  skill,
  onDelete,
}: {
  skill: UserSkill;
  onDelete: (id: number) => void;
}) {
  const isTeaching =
    skill.type === "TEACH";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.4deg] hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10">

      {/* Glow */}

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 ${
          isTeaching
            ? "bg-indigo-200/60"
            : "bg-purple-200/60"
        }`}
      />


      <div className="relative">

        <div className="flex items-start justify-between">

          {/* Skill icon */}

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br font-black transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 ${
              isTeaching
                ? "from-indigo-50 to-indigo-100 text-indigo-600"
                : "from-purple-50 to-purple-100 text-purple-600"
            }`}
          >
            {skill.name
              .charAt(0)
              .toUpperCase()}
          </div>


          {/* Delete */}

          <button
            type="button"
            onClick={() =>
              onDelete(skill.id)
            }
            className="rounded-lg px-2 py-1 text-xs font-bold text-gray-300 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          >
            Remove
          </button>

        </div>


        <h4 className="mt-4 truncate font-black text-gray-900">
          {skill.name}
        </h4>


        <div className="mt-3 flex flex-wrap gap-2">

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
              isTeaching
                ? "bg-indigo-50 text-indigo-600"
                : "bg-purple-50 text-purple-600"
            }`}
          >
            {isTeaching
              ? "Can teach"
              : "Learning"}
          </span>


          {skill.level && (
            <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">
              {skill.level}
            </span>
          )}

        </div>


        {/* Bottom shine */}

        <div className="mt-5 h-px w-full overflow-hidden bg-gray-100">

          <div
            className={`h-full w-0 transition-all duration-700 group-hover:w-full ${
              isTeaching
                ? "bg-indigo-400"
                : "bg-purple-400"
            }`}
          />

        </div>

      </div>

    </div>
  );
}

export default Profile;