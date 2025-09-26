
interface Props{
    title?:string
}
const Empty = ({ title}: Props) => {
  return (
      <div data-v-cde322bf="" className="van-empty">
          <div className="van-empty__image w-[30rem] m-auto">
              <svg viewBox="0 0 160 160">
                  <defs data-allow-mismatch="children">
                      <linearGradient x1="50%" x2="50%" y2="100%" id="van-empty-2-5">
                          <stop stopColor="#F2F3F5" offset="0%" />
                          <stop stopColor="#DCDEE0" offset="100%" />
                      </linearGradient>
                      <linearGradient
                          x1="95%"
                          y1="48%"
                          x2="5.5%"
                          y2="51%"
                          id="van-empty-2-6"
                      >
                          <stop stopColor="#EAEDF1" offset="0%" />
                          <stop stopColor="#DCDEE0" offset="100%" />
                      </linearGradient>
                      <linearGradient y1="45%" x2="100%" y2="54%" id="van-empty-2-7">
                          <stop stopColor="#EAEDF1" offset="0%" />
                          <stop stopColor="#DCDEE0" offset="100%" />
                      </linearGradient>
                  </defs>
                  <defs>
                      <linearGradient
                          id="van-empty-2-a"
                          x1="64%"
                          y1="100%"
                          x2="64%"
                          data-allow-mismatch="attribute"
                      >
                          <stop stopColor="#FFF" offset="0%" stopOpacity="0.5" />
                          <stop stopColor="#F2F3F5" offset="100%" />
                      </linearGradient>
                  </defs>
                  <g opacity=".8" data-allow-mismatch="children">
                      <path d="M36 131V53H16v20H2v58h34z" fill="url(#van-empty-2-a)" />
                      <path d="M123 15h22v14h9v77h-31V15z" fill="url(#van-empty-2-a)" />
                  </g>
                  <defs>
                      <linearGradient
                          id="van-empty-2-b"
                          x1="64%"
                          y1="97%"
                          x2="64%"
                          y2="0%"
                          data-allow-mismatch="attribute"
                      >
                          <stop stopColor="#F2F3F5" offset="0%" stopOpacity="0.3" />
                          <stop stopColor="#F2F3F5" offset="100%" />
                      </linearGradient>
                  </defs>
                  <g opacity=".8" data-allow-mismatch="children">
                      <path
                          d="M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z"
                          fill="url(#van-empty-2-b)"
                      />
                      <path
                          d="M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z"
                          fill="url(#van-empty-2-b)"
                      />
                  </g>
                  <g transform="translate(36 50)" fill="none">
                      <g transform="translate(8)">
                          <rect
                              fill="#EBEDF0"
                              opacity=".6"
                              x={38}
                              y={13}
                              width={36}
                              height={53}
                              rx={2}
                          />
                          <rect
                              fill="url(#van-empty-2-5)"
                              width={64}
                              height={66}
                              rx={2}
                              data-allow-mismatch="attribute"
                          />
                          <rect fill="#FFF" x={6} y={6} width={52} height={55} rx={1} />
                          <g
                              transform="translate(15 17)"
                              fill="url(#van-empty-2-6)"
                              data-allow-mismatch="attribute"
                          >
                              <rect width={34} height={6} rx={1} />
                              <path d="M0 14h34v6H0z" />
                              <rect y={28} width={34} height={6} rx={1} />
                          </g>
                      </g>
                      <rect
                          fill="url(#van-empty-2-7)"
                          y={61}
                          width={88}
                          height={28}
                          rx={1}
                          data-allow-mismatch="attribute"
                      />
                      <rect fill="#F7F8FA" x={29} y={72} width={30} height={6} rx={1} />
                  </g>
              </svg>
          </div>
          <p className="van-empty__description text-center">{title}</p>
          {/**/}
      </div>
  )
}

export default Empty