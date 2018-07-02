#!/usr/bin/env python

import seaborn as sns
from matplotlib import pylab as plt

N = 40
K = 32
F = .1

def binomial(n, k):
  if 0 <= k <= n:
    ntok = 1
    ktok = 1
    for t in range(1, min(k, n - k) + 1):
      ntok *= n
      ktok *= t
      n -= 1
    return ntok // ktok
  else:
    return 0

def probdur(n, k, fail):
  val = 0
  for i in range(n-k+1):
      val += binomial(n, i) * fail**i * (1-fail)**(n-i)
  return val


def nines(n, k, fail):
  if k > n:
    return 0
  val = str(probdur(n, k, fail))
  if not val.startswith("0."):
    return 0
  assert val.startswith("0."), val
  val = val[2:]
  counter = 0
  while True:
    if val[counter:counter+1] == "9":
      counter += 1
    else:
      break
  return counter

colors = sns.cubehelix_palette(
    8, dark=0, light=1, start=.5, rot=-.75, as_cmap=True)
ax = sns.heatmap(
    [[nines(n, k, F) for n in range(1,N+1)]
     for k in range(1,K+1)],
         xticklabels=[i if i % 4 == 0 else "" for i in range(1, N+1)],
         yticklabels=[i if i % 4 == 0 else "" for i in range(1, K+1)],
         cmap=colors,
         cbar_kws={"label": "9's of durability"},
         vmin=0,
         vmax=36)
ax.invert_yaxis()
plt.yticks(rotation=0)
plt.title("Durability assuming uniform %d%% probability of node failure" % (
    int(F*100)))
plt.ylabel("k", rotation=0)
plt.xlabel("n")
plt.savefig("durability.eps")

for k, n in ((2, 4), (4, 8), (8, 16), (16, 32), (32, 64)):
  print(k, n, nines(n, k, F), "%0.20f" % probdur(n, k, F))
