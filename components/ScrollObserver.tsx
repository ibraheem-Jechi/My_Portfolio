'use client'
import { useEffect } from 'react'

export default function ScrollObserver() {
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.transitionDelay = `${(i % 5) * 80}ms`
            el.classList.add('visible')
            revealObs.unobserve(el)
          }
        })
      },
      { threshold: 0.08 }
    )

    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el))

    const counterObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        entry.target.querySelectorAll<HTMLElement>('[data-target]').forEach((num) => {
          const target = parseInt(num.dataset.target ?? '0', 10)
          let current = 0
          const step = Math.max(1, Math.ceil(target / 50))
          const timer = setInterval(() => {
            current = Math.min(current + step, target)
            num.textContent = String(current)
            if (current >= target) clearInterval(timer)
          }, 28)
        })
        counterObs.unobserve(entry.target)
      },
      { threshold: 0.3 }
    )

    const statsRow = document.querySelector('.stats-row')
    if (statsRow) counterObs.observe(statsRow)

    return () => {
      revealObs.disconnect()
      counterObs.disconnect()
    }
  }, [])

  return null
}
