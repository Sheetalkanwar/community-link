import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  getCommunities,
  joinCommunity,
  leaveCommunity,
} from "../api/communities";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  joined: boolean;
  created_by: number;
}

const categories = [
  "All",
  "Study",
  "Creative",
  "Activities",
  "Technology",
  "Hobbies",
];

const communityColors: Record<string, string> = {
  Study: "bg-[#E9E3FF]",
  Creative: "bg-[#FDE2E4]",
  Activities: "bg-[#DFF3EA]",
  Technology: "bg-[#DDEBFA]",
  Hobbies: "bg-[#FFF0D8]",
};

const communityIcons: Record<string, string> = {
  Study: "✦",
  Creative: "✎",
  Activities: "♡",
  Technology: "</>",
  Hobbies: "B",
};

function Communities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const navigate = useNavigate();

  async function loadCommunities() {
    try {
      setLoading(true);
      setError("");

      const data = await getCommunities();
      setCommunities(data);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load communities"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommunities();
  }, []);

  async function handleJoinLeave(community: Community) {
    try {
      setJoiningId(community.id);
      setError("");

      const response = community.joined
        ? await leaveCommunity(community.id)
        : await joinCommunity(community.id);

      setCommunities((current) =>
        current.map((item) =>
          item.id === community.id
            ? {
                ...item,
                joined: response.joined,
                members: response.members,
              }
            : item
        )
      );
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to update community"
      );
    } finally {
      setJoiningId(null);
    }
  }

  const filteredCommunities =
    selectedCategory === "All"
      ? communities
      : communities.filter(
          (community) =>
            community.category === selectedCategory
        );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F7F4]">

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
        className="pointer-events-none absolute -left-32 top-32 h-72 w-72 rounded-full bg-[#DFF3EA] opacity-70 blur-3xl"
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
        className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#FDE2E4] opacity-60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8">

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <span className="inline-flex rounded-full bg-[#E9E3FF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#7055D6]">
                Find your people
              </span>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Communities
                <br />
                <span className="text-[#7B61D9]">
                  made for you.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                Join communities, meet people with
                similar interests, and build connections
                around things you care about.
              </p>
            </div>

            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden h-28 w-28 items-center justify-center rounded-[2rem] bg-[#F7D8DE] text-5xl shadow-sm md:flex"
            >
              ✦
            </motion.div>

          </div>
        </motion.section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <motion.button
                key={category}
                whileTap={{ scale: 0.94 }}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#7B61D9] text-white shadow-md shadow-[#DCD4FA]"
                    : "bg-white text-slate-600 shadow-sm hover:bg-[#F0ECFF] hover:text-[#7055D6]"
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
              Explore
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Discover communities
            </h2>
          </div>

          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            {filteredCommunities.length} communities
          </span>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="h-[430px] rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {!loading && filteredCommunities.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map(
              (community, index) => {
                const color =
                  communityColors[community.category] ||
                  "bg-[#E9E3FF]";

                const icon =
                  communityIcons[community.category] ||
                  "✦";

                const joining =
                  joiningId === community.id;

                return (
                  <motion.article
                  key={community.id}
                    onClick={() =>
                     navigate(`/communities/${community.id}`)
                   }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -7 }}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/70"
                  >
                    <div
                      className={`relative h-44 overflow-hidden ${color}`}
                    >
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                          rotate: [0, 5, 0],
                        }}
                        transition={{
                          duration: 4 + index * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/50"
                      />

                      <motion.div
                        animate={{
                          y: [0, 8, 0],
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 5 + index * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/40"
                      />

                      <motion.div
                        whileHover={{
                          rotate: 8,
                          scale: 1.08,
                        }}
                        className="absolute left-7 top-7 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-white text-3xl font-bold text-[#7055D6] shadow-sm"
                      >
                        {icon}
                      </motion.div>

                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                        className="absolute bottom-7 right-10 h-10 w-10 rounded-2xl bg-white/70"
                      />

                      <motion.div
                        animate={{
                          y: [0, 8, 0],
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                        }}
                        className="absolute bottom-10 right-24 h-5 w-5 rounded-full bg-white/70"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900">
                        {community.name}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-[#7B61D9]">
                        {community.category}
                      </p>

                      <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-500">
                        {community.description}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F7B8C3] text-xs font-bold">
                            A
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#BFE3D5] text-xs font-bold">
                            R
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#D5C8F5] text-xs font-bold">
                            S
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-slate-400">
                          {community.members} members
                        </span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        disabled={joining}
                        onClick={(event) => {
                         event.stopPropagation();
                           handleJoinLeave(community);
                          }}
                        className={`mt-6 w-full rounded-2xl px-5 py-3 text-sm font-bold transition ${
                          community.joined
                            ? "bg-[#DFF3EA] text-[#36856A] hover:bg-[#CDEBDD]"
                            : "bg-[#7B61D9] text-white shadow-md shadow-[#DCD4FA] hover:bg-[#6B52C8]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {joining
                          ? "Please wait..."
                          : community.joined
                            ? "Joined"
                            : "Join Community"}
                      </motion.button>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>
        )}

        {!loading && filteredCommunities.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl bg-white p-12 text-center shadow-sm"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E9E3FF] text-2xl text-[#7B61D9]">
              ✦
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No communities found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try selecting another category.
            </p>
          </motion.div>
        )}

      </div>
    </main>
  );
}

export default Communities;