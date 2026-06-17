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

    const animateCounters = (row: Element) => {
      row.querySelectorAll<HTMLElement>('[data-target]').forEach((num) => {
        const target = parseInt(num.dataset.target ?? '0', 10)
        let current = 0
        num.textContent = '0'
        const step = Math.max(1, Math.ceil(target / 40))
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          num.textContent = String(current)
          if (current >= target) clearInterval(timer)
        }, 30)
      })
    }

    const counterObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animateCounters(entry.target)
        counterObs.unobserve(entry.target)
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const statsRow = document.querySelector('.stats-row')
    if (statsRow) {
      const rect = statsRow.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        animateCounters(statsRow)
      } else {
        counterObs.observe(statsRow)
      }
    }

    return () => {
      revealObs.disconnect()
      counterObs.disconnect()
    }
  }, [])

  return null
}
