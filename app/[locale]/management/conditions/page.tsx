import { getConditions } from "@/queries/conditions/get-conditions"

import { getTranslations } from "@/lib/get-translations"
import { type Condition } from "@/lib/types/models"

import ConditionCard from "./_components/condition-card"
import MutateConditionDialog from "./_components/mutate-condition-dialog"

async function ConditionsManagementPage() {
  const t = await getTranslations("GeneralManagement")
  const conditions = await getConditions()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("condition management")}</h3>
        <div className="flex items-center gap-x-4">
          <MutateConditionDialog type="create" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {conditions.map((item: Condition) => (
          <ConditionCard key={item.conditionId} condition={item} />
        ))}
      </div>
    </div>
  )
}

export default ConditionsManagementPage
