import { Fragment } from "react"
import Skeleton from "react-loading-skeleton"

export const SkeletionComp = ({ cards }) => {
  return Array(cards).fill(0).map((_, i) => (
    <Fragment key={i}>
      <div className="card-skeletion">
        <div className="mx-auto">
          <Skeleton
            width={"145px"}
            height={"145px"}
          />
        </div>
        <div className="my-[20px]">
          <Skeleton count={2} />
        </div>
        <div>
          <Skeleton
            width={"100%"}
            height={"40px"}
          />
        </div>
      </div>
    </Fragment>
  ))
}