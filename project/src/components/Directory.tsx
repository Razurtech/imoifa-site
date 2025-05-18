import { motion } from 'framer-motion'

const guides = [
  {
    id: 1,
    name: 'Babatunde Adeyemi',
    location: 'Lagos, Nigeria',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800',
    specialties: ['Divination', 'Spiritual Healing', 'Traditional Medicine'],
  },
  {
    id: 2,
    name: 'Olayinka Oladipo',
    location: 'Ibadan, Nigeria',
    image: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=800',
    specialties: ['Ifá Consultation', 'Spiritual Counseling', 'Ritual Guidance'],
  },
]

export default function Directory() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Spiritual Guides Directory</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Connect with experienced Babaláwos and spiritual guides.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
        >
          {guides.map((guide) => (
            <article key={guide.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover"
                />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                  {guide.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    {guide.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{guide.location}</p>
                  <button className="mt-4 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
                    Contact
                  </button>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}