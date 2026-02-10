set -e
rm -rf out && yarn export && \
cat CNAME >> out/CNAME && \
cd out && touch .nojekyll &&
git init && git add . && \
git commit -m "Initial commit" && \
git remote add origin git@github.com:angary/angary.github.io.git && \
git push --force origin master:gh-pages
