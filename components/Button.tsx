export default function Button({className = "", children, ...props}: any) {
  return <button {...props} className={`${className} text-white border-2 border-white`}>{children}</button>
}