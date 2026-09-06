import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CommunityScene from "../components/CommunityScene";


function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfbff]">

      {/* ================= HERO ================= */}

      <section className="relative">

        {/* Background decoration */}

        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl"
        />


        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="mb-5 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              Connect • Learn • Grow
            </div>


            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">

              Meet people.

              <span className="block text-violet-600">
                Share skills.
              </span>

              <span className="block">
                Build your community.
              </span>

            </h1>


            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              LocalLink helps you discover people nearby,
              exchange skills, join communities and build
              meaningful connections.
            </p>


            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/explore"
                className="rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-1 hover:bg-violet-700"
              >
                Explore People
              </Link>


              <Link
                to="/matches"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:text-violet-600"
              >
                Find Matches
              </Link>

            </div>


            {/* MINI STATS */}

            <div className="mt-10 flex flex-wrap gap-8">

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  Skills
                </p>

                <p className="text-sm text-slate-500">
                  Learn from others
                </p>
              </div>


              <div>
                <p className="text-2xl font-bold text-slate-900">
                  People
                </p>

                <p className="text-sm text-slate-500">
                  Meet your community
                </p>
              </div>


              <div>
                <p className="text-2xl font-bold text-slate-900">
                  Communities
                </p>

                <p className="text-sm text-slate-500">
                  Grow together
                </p>
              </div>

            </div>

          </motion.div>


          {/* 3D SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.2,
            }}
            className="relative"
          >

            <div className="absolute inset-10 rounded-full bg-violet-200/30 blur-3xl" />

            <CommunityScene />

          </motion.div>

        </div>

      </section>



      {/* ================= QUICK ACCESS ================= */}

      <section className="border-t border-slate-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                Explore LocalLink
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Find your place here.
              </h2>

              <p className="mt-3 max-w-xl text-slate-500">
                Discover people, communities and
                opportunities that match your interests.
              </p>

            </div>

          </div>


          {/* QUICK ACCESS CARDS */}

          <div className="mt-10 grid gap-6 md:grid-cols-3">


            {/* EXPLORE */}

            <Link to="/explore">

              <motion.div
                whileHover={{
                  y: -8,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group relative overflow-hidden rounded-3xl bg-[#E9E3FF] p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-100"
              >

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 4, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/50"
                />


                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-violet-600 shadow-sm">
                    ✦
                  </div>


                  <h3 className="mt-7 text-2xl font-bold text-slate-900">
                    Explore
                  </h3>


                  <p className="mt-3 leading-7 text-slate-600">
                    Discover posts, opportunities and
                    conversations from your community.
                  </p>


                  <div className="mt-6 text-sm font-bold text-violet-700">
                    Explore posts →
                  </div>

                </div>

              </motion.div>

            </Link>



            {/* COMMUNITIES */}

            <Link to="/communities">

              <motion.div
                whileHover={{
                  y: -8,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group relative overflow-hidden rounded-3xl bg-[#DFF3EA] p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-emerald-100"
              >

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    x: [0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-white/50"
                />


                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-emerald-600 shadow-sm">
                    ♡
                  </div>


                  <h3 className="mt-7 text-2xl font-bold text-slate-900">
                    Communities
                  </h3>


                  <p className="mt-3 leading-7 text-slate-600">
                    Join groups around study, hobbies,
                    technology and shared interests.
                  </p>


                  <div className="mt-6 text-sm font-bold text-emerald-700">
                    Find communities →
                  </div>

                </div>

              </motion.div>

            </Link>



            {/* MATCHES */}

            <Link to="/matches">

              <motion.div
                whileHover={{
                  y: -8,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group relative overflow-hidden rounded-3xl bg-[#FDE2E4] p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-pink-100"
              >

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -4, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                  }}
                  className="absolute -right-5 -top-5 h-28 w-28 rounded-[2rem] bg-white/50"
                />


                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-pink-600 shadow-sm">
                    ✧
                  </div>


                  <h3 className="mt-7 text-2xl font-bold text-slate-900">
                    Matches
                  </h3>


                  <p className="mt-3 leading-7 text-slate-600">
                    Find people whose skills and interests
                    complement yours.
                  </p>


                  <div className="mt-6 text-sm font-bold text-pink-700">
                    Find your matches →
                  </div>

                </div>

              </motion.div>

            </Link>

          </div>

        </div>

      </section>



      {/* ================= FEATURES ================= */}

      <section className="border-t border-slate-100 bg-[#fcfbff]">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              What you can do
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              More than just another social app.
            </h2>

            <p className="mt-4 text-slate-500">
              LocalLink is built around real connections,
              useful skills and local communities.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <FeatureCard
              title="Meet People"
              description="Discover people with skills, interests and goals that match yours."
              icon="01"
            />

            <FeatureCard
              title="Exchange Skills"
              description="Teach what you know and learn something new from someone else."
              icon="02"
            />

            <FeatureCard
              title="Build Together"
              description="Join communities, share ideas and create meaningful connections."
              icon="03"
            />

          </div>

        </div>

      </section>

    </main>
  );
}



function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {

  return (

    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-100"
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-600 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
        {icon}
      </div>


      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>


      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

    </motion.div>

  );
}


export default Home;