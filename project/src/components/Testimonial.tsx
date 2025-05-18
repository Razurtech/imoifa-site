import { motion } from 'framer-motion'

export default function Testimonial() {
  return (
    <section className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <figure className="mx-auto max-w-2xl">
          <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-white sm:text-2xl sm:leading-9">
            <p>
              "The spiritual guidance I received through Ìmọ̀ífá's directory was life-changing. The connection to my ancestral roots has brought profound meaning to my life."
            </p>
          </blockquote>
          <figcaption className="mt-10">
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900 dark:text-white">Olayinka Adebayo</div>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900 dark:fill-white">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600 dark:text-gray-400">Lagos, Nigeria</div>
            </div>
          </figcaption>
        </figure>
      </motion.div>
    </section>
  )
}