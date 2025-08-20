import css from './Loader.module.css'
import { RingLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className={css.loader}>
      <RingLoader
        size={80}
        color="#6043a8ff"
        speedMultiplier = {2}
      />
    </div>
  )
}
