(ns curatify.doo-runner
  (:require [doo.runner :refer-macros [doo-tests]]
            [curatify.core-test]))

(doo-tests 'curatify.core-test)

